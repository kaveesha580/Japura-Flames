const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET - Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// POST - Create new project
router.post('/', async (req, res) => {
  try {
    const { title, description, eventDate, eventLocation, githubLink, status, image } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    if (!description || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }
    
    const project = new Project({
      title: title.trim(),
      description: description.trim(),
      eventDate: eventDate || '',
      eventLocation: eventLocation || '',
      githubLink: githubLink || '',
      status: status || 'In Progress',
      image: image || ''
    });
    
    const savedProject = await project.save();
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: savedProject
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// PUT - Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, eventDate, eventLocation, githubLink, status, image } = req.body;
    
    const updateData = {
      title: title?.trim(),
      description: description?.trim(),
      eventDate: eventDate || '',
      eventLocation: eventLocation || '',
      githubLink: githubLink || '',
      status: status || 'In Progress',
      image: image || ''
    };
    
    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// DELETE - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});
module.exports = router;
