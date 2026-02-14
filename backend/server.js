const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Allow requests from anywhere (important for frontend)
app.use(cors());

// ✅ Parse JSON body
app.use(express.json());

// Temporary storage (replace with database later)
let reservations = [];

/* ===============================
   ROUTES
================================ */

// Home route (so Render doesn’t crash)
app.get("/", (req, res) => {
  res.send("Cactus Restaurant API is running 🚀");
});

// Receive reservation
app.post("/reservations", (req, res) => {
  const reservation = req.body;

  if (!reservation.name || !reservation.phone || !reservation.email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  reservations.push(reservation);

  console.log("New Reservation:", reservation);

  res.json({
    success: true,
    message: "Reservation received successfully!",
  });
});

// View all reservations (for testing)
app.get("/reservations", (req, res) => {
  res.json(reservations);
});

/* ===============================
   IMPORTANT FOR RENDER
================================ */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
