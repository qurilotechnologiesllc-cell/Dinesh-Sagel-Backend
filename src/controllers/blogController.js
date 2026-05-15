const Blog = require('../models/blog.model');
const { deleteImage } = require('../utils/cloudinary');

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        const { title, content, blogImage, public_id } = req.body;
        const newBlog = new Blog({ title, content, blogImage, public_id });
        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        res.status(500).json({ message: 'Error creating blog', error: error.message });
    }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blogs', error: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        await deleteImage(blog.public_id);
        await Blog.findByIdAndDelete(id);
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog', error: error.message });
    }
};