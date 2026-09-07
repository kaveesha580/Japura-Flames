const express = require('express');
const router = express.Router();
const Crew = require('../models/Crew');


router.get('/', async (req, res) => {
  try {
    const crew = await Crew.find().sort({ createdAt: -1 });
    res.json(crew);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const crew = await Crew.findById(req.params.id);
    if (!crew) {
      return res.status(404).json({ message: 'Crew member not found' });
    }
    res.json(crew);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Add new crew member

router.post('/', async (req, res) => {
  try {
    const { name, unit, phone, email, role, image } = req.body;
    
    const crew = new Crew({
      name,
      unit: unit || 'Photography',
      phone,
      email: email ? email.trim() : '',
      role: role || 'Member',
      image: image || ''
    });
    
    const savedCrew = await crew.save();
    res.status(201).json(savedCrew);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update crew member

router.put('/:id', async (req, res) => {
  try {
    const { name, unit, phone, email, role, image } = req.body;
    
    const crew = await Crew.findById(req.params.id);
    if (!crew) {
      return res.status(404).json({ message: 'Crew member not found' });
    }
    
    const updatedCrew = await Crew.findByIdAndUpdate(
      req.params.id,
      { name, unit, phone, email: email ? email.trim() : '', role, image },
      { new: true, runValidators: true }
    );
    
    res.json(updatedCrew);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete crew member

router.delete('/:id', async (req, res) => {
  try {
    const crew = await Crew.findByIdAndDelete(req.params.id);
    if (!crew) {
      return res.status(404).json({ message: 'Crew member not found' });
    }
    res.json({ message: 'Crew member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;