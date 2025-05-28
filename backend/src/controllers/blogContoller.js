const blogModel = require('../models/blogModel');

const db = require('../config/db'); // your MySQL connection/pool


exports.saveDraft = async (req, res) => {
  try {
    const blog = await blogModel.saveDraft(req.body);
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save draft' });
  }
};

exports.publishBlog = async (req, res) => {
  try {
    const blog = await blogModel.publishBlog(req.body);
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to publish blog' });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.getAllBlogs();
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get blogs' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await blogModel.getBlogById(req.params.id);
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get blog' });
  }
};

// 🆕 Delete blog by ID
exports.deleteBlog = async (req, res) => {
  try {
    const deleted = await blogModel.deleteBlog(req.params.id);
    if (deleted) {
      res.json({ message: 'Blog deleted successfully' });
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
