// D:\calplate\backend\routes\aiMealSuggestion.js
import express from "express";
import OpenAI from "openai";

const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate AI-based meal suggestions
 * Example return:
 * [
 *   { name: "Grilled Chicken Salad", description: "Lean chicken with greens", calories: 420, time: 20 },
 *   { name: "Oatmeal Bowl", description: "Oats, banana, almond butter", calories: 350, time: 10 }
 * ]
 */
router.get("/", async (req, res) => {
  try {
    const prompt = `
    Suggest 5 healthy meal ideas in JSON format.
    Each meal should have:
    - name
    - description
    - calories (number)
    - time (minutes required)
    Return strictly valid JSON array.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let meals = [];
    try {
      meals = JSON.parse(completion.choices[0].message.content);
    } catch (err) {
      console.error("AI JSON parse error:", err);
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    res.json({ meals });
  } catch (error) {
    console.error("AI Meal Suggestion Error:", error);
    res.status(500).json({ error: "Failed to fetch meal suggestions" });
  }
});

export default router;
