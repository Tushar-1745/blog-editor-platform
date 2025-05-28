import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { getAllBlogs, deleteBlog } from '../api/BlogApi';

const BlogListPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [activeTab, setActiveTab] = useState('published');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [optionsOpen, setOptionsOpen] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const navigate = useNavigate();
  const optionsRef = useRef();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if user is logged in (modify this logic as per your auth flow)
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  function stripHtmlTags(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  useEffect(() => {
    if (!isLoggedIn) return;  // Only fetch blogs if logged in
    setLoading(true);
    getAllBlogs()
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch blogs:', err);
        setError('Failed to load blogs');
        setLoading(false);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOptionsOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateBlog = () => navigate('/create-blog');

  const filteredBlogs = blogs.filter(blog => {
    if (activeTab === 'published') return blog.status === 'published';
    if (activeTab === 'drafts') return blog.status === 'draft';
    return false;
  });

  const confirmDelete = (blogId) => {
    deleteBlog(blogId)
      .then(() => {
        setBlogs(prev => prev.filter(blog => blog.id !== blogId));
        setBlogToDelete(null);
      })
      .catch(err => {
        console.error('Delete failed:', err);
        alert('Failed to delete the blog.');
      });
  };

  return (
    <div style={styles.pageBackground}>
      <Navbar />
      <div style={styles.pageContainer} className={fadeIn ? 'fade-in' : ''}>
        {!isLoggedIn ? (
          <div style={styles.loginMessage}>
            <h2>Please login to the platform to get the services.</h2>
          </div>
        ) : (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>My Blogs</h1>
              <button style={styles.createButton} onClick={handleCreateBlog}>
                + Create Blog
              </button>
            </div>

            <div style={styles.tabsContainer}>
              {['published', 'drafts'].map(tab => (
                <button
                  key={tab}
                  style={{
                    ...styles.tabButton,
                    backgroundColor: activeTab === tab ? '#d6f0ff' : 'transparent',
                    color: activeTab === tab ? '#0077b6' : '#333',
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div style={styles.tabContent}>
              {loading && <p>Loading blogs...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}

              {!loading && !error && filteredBlogs.length === 0 && (
                <div style={styles.emptyState} className="tab-fade">
                  <p>{activeTab === 'drafts' ? 'You have no drafts yet.' : 'No blogs to display.'}</p>
                </div>
              )}

              {!loading && !error && filteredBlogs.length > 0 && (
                <div style={styles.blogWrapper} className="tab-fade">
                  {filteredBlogs.map(blog => (
                    <div key={blog.id} style={styles.blogCard} ref={optionsOpen === blog.id ? optionsRef : null}>
                      <div style={styles.optionsMenuContainer}>
                        <button
                          style={styles.optionsButton}
                          onClick={() =>
                            setOptionsOpen(optionsOpen === blog.id ? null : blog.id)
                          }
                        >
                          &#x2630;
                        </button>
                        {optionsOpen === blog.id && (
                          <div style={styles.dropdownMenu}>
                            <div style={styles.dropdownItem} onClick={() => navigate(`/blog/${blog.id}`)}>View</div>
                            <div style={styles.dropdownItem} onClick={() => navigate(`/blog-editor/${blog.id}`)}>Edit</div>
                            <div style={styles.dropdownItem} onClick={() => setBlogToDelete(blog)}>Delete</div>
                          </div>
                        )}
                      </div>

                      <h3 style={styles.blogTitle}>{blog.title}</h3>
                      <p style={styles.blogTagline}>{blog.tagline || <i>No tagline</i>}</p>
                      <p style={styles.blogDescription}>
                        {stripHtmlTags(blog.content).substring(0, 200)}
                      </p>
                      <div style={styles.tagsContainer}>
                        {blog.tags && blog.tags.length > 0 ? blog.tags.slice(0, 4).join(', ') : <i>No tags</i>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {blogToDelete && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete the blog "{blogToDelete.title}"?</p>
            <button style={styles.modalButton} onClick={() => confirmDelete(blogToDelete.id)}>Yes, Delete</button>
            <button style={styles.modalButton} onClick={() => setBlogToDelete(null)}>Cancel</button>
          </div>
        </div>
      )}
      <style>
        {`
    .fade-in { opacity: 1; transform: translateY(0); }
    .tab-fade { animation: fadeIn 0.5s ease-in-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}
      </style>
    </div>
  );
};


const styles = {
  loginMessage: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.2rem',
    color: '#333',
  },
  pageBackground: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #d0f0f7, #e0ffe0)',
    paddingBottom: '50px',
  },
  pageContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'opacity 0.7s ease, transform 0.7s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 600,
    color: '#2b3d4f',
  },
  createButton: {
    padding: '10px 18px',
    backgroundColor: '#a2e3f6',
    color: '#055f79',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background-color 0.3s ease',
  },
  tabsContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  tag: {
    fontSize: '0.85rem',
    color: '#055f79',
    fontWeight: '600',
    userSelect: 'none',
  },
  tagsContainer: {
    marginTop: '6px',
    fontSize: '0.85rem',
    color: '#055f79',
    fontWeight: '600',
  },
  tabButton: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabContent: {
    minHeight: '200px',
  },
  blogWrapper: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    padding: '25px 20px',
    display: 'grid',
    gap: '15px',
  },
  blogCard: {
    backgroundColor: '#f8fafd',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    position: 'relative',
  },
  optionsMenuContainer: {
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  optionsButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '30px',
    right: '0',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 100,
  },
  dropdownItem: {
    padding: '8px 12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  modalButton: {
    margin: '10px',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default BlogListPage;
