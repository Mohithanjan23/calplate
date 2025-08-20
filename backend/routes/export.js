// D:\calplate\backend\routes\export.js
import express from "express";
import { createObjectCsvWriter } from "csv-writer";

const router = express.Router();

// Mock data for meals (replace with Supabase DB later)
const mockMeals = [
  { date: "2025-08-20", meal: "Breakfast", item: "Oatmeal", calories: 300 },
  { date: "2025-08-20", meal: "Lunch", item: "Grilled Chicken Salad", calories: 450 },
  { date: "2025-08-20", meal: "Dinner", item: "Veggie Pasta", calories: 500 },
];

// GET → /api/export
router.get("/", async (req, res) => {
  try {
    const filePath = "./meals_export.csv";

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "date", title: "Date" },
        { id: "meal", title: "Meal" },
        { id: "item", title: "Item" },
        { id: "calories", title: "Calories" },
      ],
    });

    await csvWriter.writeRecords(mockMeals);

    res.download(filePath, "meals_export.csv");
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Failed to export meals" });
  }
});

export default router;
