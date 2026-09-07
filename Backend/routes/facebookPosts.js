const express = require('express');
const router = express.Router();
const FacebookPost = require('../models/FacebookPost');

router.get('/', async (req, res) => {
  try {
    const posts = await FacebookPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { url, height } = req.body;
    if (!url || !/^https?:\/\/(www\.|web\.)?facebook\.com\//i.test(url.trim())) {
      return res.status(400).json({ message: 'Please enter a valid Facebook post URL' });
    }

    const post = await FacebookPost.create({
      url: url.trim(),
      height: Number(height) || 808
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await FacebookPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Facebook post not found' });
    res.json({ message: 'Facebook post deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
