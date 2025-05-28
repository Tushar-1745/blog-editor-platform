import React, { useEffect, useState } from 'react';
import { getAllBlogs, getBlogById, } from '../api/BlogApi';
import BlogItem from './BlogItem';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getAllBlogs().then(setBlogs);
  }, []);

  const drafts = blogs.filter(b => b.status === 'draft');
  const published = blogs.filter(b => b.status === 'published');

  return (
    <div>
      <h2>Drafts</h2>
      {drafts.map(blog => <BlogItem key={blog.id} blog={blog} />)}

      <h2>Published</h2>
      {published.map(blog => <BlogItem key={blog.id} blog={blog} />)}
    </div>
  );
};

export default BlogList;
