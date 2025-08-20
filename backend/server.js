import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import exportRoute from "./routes/export.js";
import aiMealSuggestionRoute from "./routes/aiMealSuggestion.js";
import syncRoute from "./routes/sync.js";
import remindersRoute from "./routes/reminders.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/export", exportRoute);
app.use("/api/aiMealSuggestion", aiMealSuggestionRoute);
app.use("/api/sync", syncRoute);
app.use("/api/reminders", remindersRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
