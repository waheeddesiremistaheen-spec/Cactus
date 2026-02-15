const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

/* ===============================
   MONGODB CONNECTION
================================ */

mongoose.connect(
  "mongodb+srv://waheeddesiremistaheen_db_user:<waheedtenidesireanu7%40>@cactus.lwga2qx.mongodb.net/?appName=Cactus"
)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));


/* ===============================
   MIDDLEWARE
================================ */

app.use(cors());
app.use(express.json());


/* ===============================
   SCHEMA & MODEL
================================ */

const reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  date: String,
  time: String,
  guests: Number
});

const Reservation = mongoose.model("Reservation", reservationSchema);


/* ===============================
   ROUTES
================================ */

// Home route
app.get("/", (req, res) => {
  res.send("Cactus Restaurant API is running 🚀");
});


// Save reservation to MongoDB
app.post("/reservations", async (req, res) => {
  try {
    const { name, phone, email, date, time, guests } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReservation = new Reservation({
      name,
      phone,
      email,
      date,
      time,
      guests
    });

    await newReservation.save();

    console.log("New Reservation Saved:", newReservation);

    res.json({
      success: true,
      message: "Reservation received successfully!"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save reservation" });
  }
});


// View all reservations (for testing)
app.get("/reservations", async (req, res) => {
  try {
    const allReservations = await Reservation.find();
    res.json(allReservations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});


/* ===============================
   SERVER
================================ */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
