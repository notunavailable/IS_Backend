const express = require('express');
const Ability = require('../../models/Ability.js')
const router = express.Router();

// Ability registration
router.post("/register", async (req, res) => {
  const ability = await Ability.findOne({ name: req.body.name });

  if (ability) {
    return res.status(400).send({
      message: "The ability already exists"
    })
  } else {
    const newAbility = new Ability(req.body)
    newAbility.save().catch(err => console.log(err));
    return res.status(201).send(newAbility);
  }
});

// Get all abilities
router.get("/", async (req, res) => {
  try {
    const abilities = await Ability.find();
    res.status(200).send(abilities);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving abilities" });
  }
});

// Get ability by ID
router.get("/:id", async (req, res) => {
  try {
    const ability = await Ability.findById(req.params.id);
    if (ability) {
      res.status(200).send(ability);
    } else {
      res.status(404).send({ message: "Ability not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error retrieving ability" });
  }
});

// Update ability by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedAbility = await Ability.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedAbility) {
      res.status(200).send(updatedAbility);
    } else {
      res.status(404).send({ message: "Ability not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error updating ability" });
  }
});

// Delete ability by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedAbility = await Ability.findByIdAndRemove(req.params.id);
    if (deletedAbility) {
      res.status(200).send({ message: "Ability successfully deleted" });
    } else {
      res.status(404).send({ message: "Ability not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error deleting ability" });
  }
});

module.exports = router;