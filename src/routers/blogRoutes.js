const express = require('express');
const router = express.Router();
const { createBlog, getAllBlogs, deleteBlog } = require("../controllers/blogController");

// Create a new blog
router.post('/blogs', createBlog);

// Get all blogs
router.get('/blogs', getAllBlogs);

// Delete a blog by ID
router.delete('/blogs/:id', deleteBlog);

module.exports = router;