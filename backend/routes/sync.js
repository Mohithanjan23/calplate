// D:\calplate\backend\routes\sync.js
import express from "express";

const router = express.Router();

/**
 * Example route to sync wearable device data (mocked).
 * Later, you can integrate Fitbit, Apple Health, Garmin, etc.
 */
router.post("/", async (req, res) => {
  try {
    const { device, steps, caloriesBurned } = req.body;

    // Mock: Just echo back
    const syncedData = {
      device: device || "Fitbit",
      steps: steps || 8000,
      caloriesBurned: caloriesBurned || 320,
      syncedAt: new Date().toISOString(),
    };

    res.json({ message: "Sync successful", data: syncedData });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Failed to sync data" });
  }
});

export default router;
