import React from 'react';
import { Link } from 'react-router-dom';

const BlogItem = ({ blog }) => {
  return (
    <div className="blog-item">
      <h3>{blog.title}</h3>
      <p>{blog.content.slice(0, 100)}...</p>
      <p>Tags: {blog.tags.join(', ')}</p>
      <Link to={`/editor/${blog.id}`}>Edit</Link>
    </div>
  );
};

export default BlogItem;
