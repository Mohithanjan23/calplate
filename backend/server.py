from fastapi import FastAPI, APIRouter, HTTPException
from fastapi import Body
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ValidationError, field_validator
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import base64

# LLM (Emergent Integrations)
try:
# Note: All backend routes must be prefixed with /api per ingress rules.

    from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
    EMERGENT_AVAILABLE = True
except Exception:  # pragma: no cover
    EMERGENT_AVAILABLE = False


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (must use MONGO_URL + DB_NAME from env)
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="CalPlate Nutrition API", version="0.1.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# -----------------------------
# Models
# -----------------------------
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class NutritionProfile(BaseModel):
    age: int = Field(..., ge=5, le=120)
    gender: str = Field(..., description="male or female")
    height_cm: float = Field(..., gt=30, lt=260)
    weight_kg: float = Field(..., gt=10, lt=400)
    activity_level: str = Field(..., description="sedentary|light|moderate|active|very_active")
    goal: str = Field(..., description="lose|maintain|gain")
    rate_kg_per_week: Optional[float] = Field(None, ge=0.1, le=1.5, description="optional rate for lose/gain")

    @field_validator('gender')
    @classmethod
    def _gender(cls, v: str) -> str:
        v2 = v.lower().strip()
        if v2 not in {"male", "female"}:
            raise ValueError("gender must be 'male' or 'female'")
        return v2

    @field_validator('activity_level')
    @classmethod
    def _activity(cls, v: str) -> str:
        v2 = v.lower().strip()
        allowed = {"sedentary", "light", "moderate", "active", "very_active"}
        if v2 not in allowed:
            raise ValueError(f"activity_level must be one of {allowed}")
        return v2

    @field_validator('goal')
    @classmethod
    def _goal(cls, v: str) -> str:
        v2 = v.lower().strip()
        allowed = {"lose", "maintain", "gain"}
        if v2 not in allowed:
            raise ValueError(f"goal must be one of {allowed}")
        return v2

class DailyTarget(BaseModel):
    bmr: float
    tdee: float
    target_calories: float
    details: Dict[str, Any] = Field(default_factory=dict)

class FoodItem(BaseModel):
    name: str
    quantity: Optional[str] = None
    calories: float
    macros: Optional[Dict[str, float]] = None

class VisionAnalyzeRequest(BaseModel):
    image_base64: str = Field(..., description="Data URL or raw base64 string")
    prompt: Optional[str] = Field(None, description="Optional extra context like portion size")

    @field_validator('image_base64')
    @classmethod
    def _validate_b64(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("image_base64 must be a string")
        # Allow data URL or pure base64
        try:
            b64 = v.split(',')[1] if v.startswith('data:') else v
            _ = base64.b64decode(b64, validate=True)
        except Exception:
            raise ValueError("image_base64 is not valid base64 or data URL")
        return v

class VisionAnalyzeResponse(BaseModel):
    id: str
    created_at: datetime
    total_calories: float
    food_items: List[FoodItem]
    raw_model_text: str

# -----------------------------
# Utils
# -----------------------------
ACTIVITY_FACTORS = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9,
}

def calculate_daily_target(p: NutritionProfile) -> DailyTarget:
    # Mifflin-St Jeor BMR
    if p.gender == "male":
        bmr = 10 * p.weight_kg + 6.25 * p.height_cm - 5 * p.age + 5
    else:
        bmr = 10 * p.weight_kg + 6.25 * p.height_cm - 5 * p.age - 161

    tdee = bmr * ACTIVITY_FACTORS[p.activity_level]

    # Goal adjustment
    target = tdee
    details: Dict[str, Any] = {"formula": "Mifflin-St Jeor", "activity_factor": ACTIVITY_FACTORS[p.activity_level]}

    if p.goal == "lose":
        # Default moderate deficit ~500 kcal/day or based on rate_kg_per_week (7700 kcal/kg)
        if p.rate_kg_per_week:
            deficit = min(1000.0, max(200.0, p.rate_kg_per_week * 7700 / 7))
        else:
            deficit = 500.0
        target = max(1200.0, tdee - deficit)
        details.update({"deficit": deficit})
    elif p.goal == "gain":
        if p.rate_kg_per_week:
            surplus = min(1000.0, max(200.0, p.rate_kg_per_week * 7700 / 7))
        else:
            surplus = 300.0
        target = tdee + surplus
        details.update({"surplus": surplus})

    return DailyTarget(bmr=round(bmr, 2), tdee=round(tdee, 2), target_calories=round(target, 0), details=details)

async def call_gpt4o_vision(image_b64: str, prompt: Optional[str]) -> Dict[str, Any]:
    if not EMERGENT_AVAILABLE:
        raise HTTPException(status_code=500, detail="LLM integration not available on server")

    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY missing in environment")

    system_message = (
        "You are a meticulous nutrition analyst. Given a food photo, estimate calories and macros. "
        "Respond with STRICT JSON only, no backticks, no extra text. Schema: {\n"
        "  \"food_items\": [ { \"name\": str, \"quantity\": str?, \"calories\": float, \"macros\": {\"protein\": float, \"carbs\": float, \"fat\": float}? } ],\n"
        "  \"total_calories\": float\n"
        "}"
    )

    # Build user instruction
    user_text = (
        "Analyze this food image. Estimate realistic portion sizes. "
        "Return strict JSON only. If multiple items, split into separate food_items."
    )
    if prompt:
        user_text += f" Context: {prompt}"

    # Accept either data URL or raw base64
    img_b64 = image_b64.split(',')[1] if image_b64.startswith('data:') else image_b64

    # Create chat per request
    chat = (
        LlmChat(api_key=api_key, session_id=str(uuid.uuid4()), system_message=system_message)
        .with_model("openai", "gpt-4o")
    )

    message = UserMessage(text=user_text, file_contents=[ImageContent(image_base64=img_b64)])

    try:
        response_text = await chat.send_message(message)
    except Exception as e:  # pragma: no cover
        logging.exception("LLM call failed")
        raise HTTPException(status_code=502, detail=f"LLM error: {str(e)}")

    # Ensure it's JSON we can parse
    import json

    try:
        # Some providers might return response object; handle string robustly
        if isinstance(response_text, (dict, list)):
            parsed = response_text
        else:
            cleaned = str(response_text).strip()
            # Remove code fences if any
            if cleaned.startswith("```") or cleaned.startswith("```json"):
                cleaned = cleaned.strip('`')
                # Try to find JSON inside
                start = cleaned.find('{')
                end = cleaned.rfind('}')
                if start != -1 and end != -1:
                    cleaned = cleaned[start:end+1]
            parsed = json.loads(cleaned)
    except Exception as e:
        # As a fallback, wrap as single item
        logging.warning("Failed to parse LLM JSON strictly; returning fallback structure. err=%s", e)
        parsed = {"food_items": [], "total_calories": 0.0}

    # Normalize structure
    food_items = []
    total_calories = 0.0

    try:
        items = parsed.get("food_items", []) if isinstance(parsed, dict) else []
        for it in items:
            try:
                name = str(it.get("name", "item")).strip()
                calories = float(it.get("calories", 0.0))
                quantity = it.get("quantity")
                macros = it.get("macros") if isinstance(it.get("macros"), dict) else None
                food_items.append(FoodItem(name=name, calories=calories, quantity=quantity, macros=macros))
                total_calories += calories
            except Exception:
                continue
        # Prefer model's total if present
        if isinstance(parsed, dict) and isinstance(parsed.get("total_calories"), (int, float)):
            total_calories = float(parsed["total_calories"])
    except Exception:
        pass

    return {
        "food_items": [fi.model_dump() for fi in food_items],
        "total_calories": round(float(total_calories), 1),
        "raw_model_text": str(response_text),
    }

# -----------------------------
# Routes
# -----------------------------
@api_router.get("/")
async def root():
    return {"message": "CalPlate backend alive"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(client_name=input.client_name)
    await db.status_checks.insert_one({**status_obj.model_dump(), "_id": status_obj.id})
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    docs = await db.status_checks.find().sort("timestamp", -1).to_list(100)
    results: List[StatusCheck] = []
    for d in docs:
        try:
            results.append(StatusCheck(**{k: v for k, v in d.items() if k != "_id"}))
        except ValidationError:
            continue
    return results

@api_router.post("/nutrition/target", response_model=DailyTarget)
async def get_daily_target(profile: NutritionProfile):
    try:
        res = calculate_daily_target(profile)
        return res
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/vision/analyze", response_model=VisionAnalyzeResponse)
async def vision_analyze(body: VisionAnalyzeRequest = Body(...)):
    # Call model
    payload = await call_gpt4o_vision(body.image_base64, body.prompt)

    meal_id = str(uuid.uuid4())
    doc = {
        "id": meal_id,
        "created_at": datetime.utcnow(),
        "image_base64": body.image_base64,  # store base64 as per requirement
        "food_items": payload["food_items"],
        "total_calories": payload["total_calories"],
        "raw_model_text": payload["raw_model_text"],
    }
    try:
        await db.meals.insert_one({**doc, "_id": meal_id})
    except Exception as e:  # pragma: no cover
        logging.warning("Failed to store meal doc: %s", e)

    return VisionAnalyzeResponse(
        id=meal_id,
        created_at=doc["created_at"],
        total_calories=doc["total_calories"],
        food_items=[FoodItem(**fi) for fi in doc["food_items"]],
        raw_model_text=doc["raw_model_text"],
    )

@api_router.get("/meals", response_model=List[VisionAnalyzeResponse])
async def list_meals(limit: int = 20):
    docs = await db.meals.find().sort("created_at", -1).to_list(limit)
    results: List[VisionAnalyzeResponse] = []
    for d in docs:
        try:
            results.append(VisionAnalyzeResponse(**{k: v for k, v in d.items() if k != "_id"}))
        except ValidationError:
            continue
    return results

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
