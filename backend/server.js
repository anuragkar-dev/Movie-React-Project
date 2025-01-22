const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/movieApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Favorite Schema
const favoriteSchema = new mongoose.Schema({
  userId: String, // To support multiple users in the future
  movieId: String,
  title: String,
  poster: String,
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

// Routes
// Get all favorites for a user
app.get("/favorites/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const favorites = await Favorite.find({ userId });
    res.json(favorites);
  } catch (error) {
    res.status(500).send("Error fetching favorites");
  }
});

// Add a favorite
app.post("/favorites", async (req, res) => {
  const { userId, movieId, title, poster } = req.body;
  try {
    const favorite = new Favorite({ userId, movieId, title, poster });
    await favorite.save();
    res.status(201).send("Favorite added");
  } catch (error) {
    res.status(500).send("Error adding favorite");
  }
});

// Remove a favorite
app.delete("/favorites/:userId/:movieId", async (req, res) => {
  const { userId, movieId } = req.params;
  try {
    await Favorite.deleteOne({ userId, movieId });
    res.send("Favorite removed");
  } catch (error) {
    res.status(500).send("Error removing favorite");
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
