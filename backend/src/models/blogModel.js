const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define Blog model
const Blog = sequelize.define('Blog', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON,  // Store array of tags as JSON
    allowNull: false,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    allowNull: false,
    defaultValue: 'draft',
  },
  importantDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tagline: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'blogs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Save Draft
async function saveDraft({ id, title, content, tags, importantDescription, tagline }) {
  if (id) {
    const blog = await Blog.findByPk(id);
    if (!blog) throw new Error('Blog not found');

    blog.title = title;
    blog.content = content;
    blog.tags = tags;
    blog.status = 'draft';
    blog.importantDescription = importantDescription;
    blog.tagline = tagline;
    await blog.save();

    return blog;
  } else {
    const newBlog = await Blog.create({
      title,
      content,
      tags,
      status: 'draft',
      importantDescription,
      tagline,
    });

    return newBlog;
  }
}

// Publish Blog
async function publishBlog({ id, title, content, tags, importantDescription, tagline }) {
  if (id) {
    const blog = await Blog.findByPk(id);
    if (!blog) throw new Error('Blog not found');

    blog.title = title;
    blog.content = content;
    blog.tags = tags;
    blog.status = 'published';
    blog.importantDescription = importantDescription;
    blog.tagline = tagline;
    await blog.save();

    return blog;
  } else {
    const newBlog = await Blog.create({
      title,
      content,
      tags,
      status: 'published',
      importantDescription,
      tagline,
    });

    return newBlog;
  }
}

// Get all blogs
async function getAllBlogs() {
  return Blog.findAll({
    order: [['updated_at', 'DESC']],
  });
}

// Get blog by id
async function getBlogById(id) {
  return Blog.findByPk(id);
}

async function deleteBlog(id) {
  const deletedCount = await Blog.destroy({
    where: { id }
  });
  return deletedCount > 0;
}

module.exports = {
  saveDraft,
  publishBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog
};
