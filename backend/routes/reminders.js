// D:\calplate\backend\routes\reminders.js
import express from "express";

const router = express.Router();

// Mock reminders (could be stored in Supabase)
let reminders = [
  { id: 1, message: "Drink water 💧", time: "09:00" },
  { id: 2, message: "Log your lunch 🍲", time: "13:00" },
];

// GET → /api/reminders
router.get("/", (req, res) => {
  res.json(reminders);
});

// POST → /api/reminders
router.post("/", (req, res) => {
  const { message, time } = req.body;
  const newReminder = { id: reminders.length + 1, message, time };
  reminders.push(newReminder);
  res.json({ message: "Reminder added", reminder: newReminder });
});

// DELETE → /api/reminders/:id
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  reminders = reminders.filter((r) => r.id !== id);
  res.json({ message: "Reminder deleted" });
});

export default router;
