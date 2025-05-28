import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById } from '../api/BlogApi'; // Adjust path as needed

const ViewBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getBlogById(id)
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load blog.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={styles.message}>Loading...</p>;
  if (error) return <p style={{ ...styles.message, color: '#b00020' }}>{error}</p>;
  if (!blog) return <p style={styles.message}>Blog not found.</p>;

  return (
    <main style={styles.pageBackground}>
      <div style={styles.container}>
        <button
          onClick={() => navigate(`/blog-editor/${id}`)}
          style={styles.editButton}
          aria-label="Edit Blog"
        >
          Edit
        </button>

        <h1 style={styles.title}>{blog.title}</h1>
        {blog.tagline && <p style={styles.tagline}>{blog.tagline}</p>}
        {blog.importantDescription && (
          <section style={styles.importantDescription}>{blog.importantDescription}</section>
        )}

        <article
          style={styles.content}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.tags && blog.tags.length > 0 && (
          <footer style={styles.tagsContainer}>
            {blog.tags.map((tag, index) => (
              <span key={index} style={styles.tag}>
                {tag}
              </span>
            ))}
          </footer>
        )}
      </div>
    </main>
  );
};

const styles = {
  pageBackground: {
    minHeight: '100vh',
    padding: '4rem 1rem',
    background: `
      linear-gradient(135deg, #fafafa 25%, #f0f4f8 25%, #f0f4f8 50%, #fafafa 50%, #fafafa 75%, #f0f4f8 75%, #f0f4f8 100%),
      linear-gradient(45deg, #fafafa 25%, #f0f4f8 25%, #f0f4f8 50%, #fafafa 50%, #fafafa 75%, #f0f4f8 75%, #f0f4f8 100%)`,
    backgroundSize: '40px 40px',
    backgroundPosition: '0 0, 20px 20px',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    maxWidth: 800,
    width: '100%',
    backgroundColor: '#fff',
    padding: '3rem 3.5rem 4rem 3.5rem',
    borderRadius: '12px',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Georgia', serif",
    color: '#222',
    lineHeight: 1.7,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    backgroundColor: 'transparent',
    border: '1.5px solid #444',
    borderRadius: 4,
    padding: '6px 14px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#444',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.03em',
  },
  title: {
    fontSize: '2.75rem',
    fontWeight: '700',
    marginBottom: '0.3rem',
    color: '#111',
    letterSpacing: '-0.02em',
  },
  tagline: {
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '1.125rem',
    color: '#555',
    marginBottom: '1.5rem',
    borderLeft: '4px solid #ccc',
    paddingLeft: '1rem',
  },
  importantDescription: {
    fontSize: '1rem',
    fontWeight: '500',
    backgroundColor: '#f7f7f7',
    padding: '1rem 1.25rem',
    borderRadius: 6,
    color: '#444',
    marginBottom: '2rem',
    boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.05)',
  },
  content: {
    fontSize: '1.125rem',
    color: '#333',
    marginBottom: '3rem',
    wordWrap: 'break-word',
  },
  tagsContainer: {
    borderTop: '1px solid #eee',
    paddingTop: '1rem',
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0e0e0',
    color: '#555',
    fontSize: '0.875rem',
    padding: '6px 14px',
    borderRadius: '20px',
    fontWeight: '500',
    userSelect: 'none',
  },
  message: {
    textAlign: 'center',
    marginTop: '6rem',
    fontSize: '1.125rem',
    color: '#666',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
};

export default ViewBlog;
