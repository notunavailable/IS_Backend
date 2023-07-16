const express = require("express");
const Difficulty = require("../../models/Difficulty.js");
const {populateDifficulties} = require("../../utils/xp.js")
const router = express.Router();

// Get all difficulties
router.get("/", async (req, res) => {
  try {
    const difficulties = await Difficulty.find();
    res.status(200).json(difficulties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching difficulties." });
  }
});

router.post("/populate", async (req, res) => {
    try {
      const difficulties = await populateDifficulties();
      res.status(200).json(difficulties);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while populating difficulties." });
    }
  });

// Get a specific difficulty by ID
router.get("/:id", async (req, res) => {
  try {
    const difficulty = await Difficulty.findById(req.params.id);
    if (!difficulty) {
      return res.status(404).json({ message: "Difficulty not found." });
    }
    res.status(200).json(difficulty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching the difficulty." });
  }
});

// Create new difficulty
router.post("/", async (req, res) => {
  try {
    const newDifficulty = new Difficulty(req.body);
    const savedDifficulty = await newDifficulty.save();
    res.status(201).json(savedDifficulty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating the difficulty." });
  }
});

// Update a specific difficulty by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedDifficulty = await Difficulty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDifficulty) {
      return res.status(404).json({ message: "Difficulty not found." });
    }
    res.status(200).json(updatedDifficulty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the difficulty." });
  }
});

// Delete a specific difficulty by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedDifficulty = await Difficulty.findByIdAndDelete(req.params.id);
    if (!deletedDifficulty) {
      return res.status(404).json({ message: "Difficulty not found." });
    }
    res.status(200).json({ message: "Difficulty deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while deleting the difficulty." });
  }
});

module.exports = router;