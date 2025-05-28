import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { toast, ToastContainer } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

import { saveDraft, publishBlog, getBlogById } from '../api/BlogApi';
import { AuthContext } from '../context/AuthContext';

const BlogEditor = () => {
  const { id: initialBlogId } = useParams();
  const navigate = useNavigate();
  const { loggedInUser } = useContext(AuthContext);

  // Use local state for blogId so we can update it when a new draft is created
  const [blogId, setBlogId] = useState(initialBlogId || null);

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [importantDescription, setImportantDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const saveTimeoutRef = useRef(null);
  const lastSavedData = useRef({
    title: '',
    tagline: '',
    importantDescription: '',
    content: '',
    tags: [],
  });

  useEffect(() => {
    if (blogId) {
      getBlogById(blogId)
        .then(data => {
          setTitle(data.title || '');
          setTagline(data.tagline || '');
          setImportantDescription(data.importantDescription || '');
          setContent(data.content || '');
          setTags(data.tags ? data.tags.join(', ') : '');
          lastSavedData.current = {
            title: data.title || '',
            tagline: data.tagline || '',
            importantDescription: data.importantDescription || '',
            content: data.content || '',
            tags: data.tags || [],
          };
        })
        .catch(err => {
          console.error(err);
          toast.error('Failed to load blog data');
        });
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [blogId]);

  const tagsChanged = (a, b) => {
    if (a.length !== b.length) return true;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return true;
    }
    return false;
  };

  const triggerAutoSave = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      // Auto-save: no toast, no redirect
      handleSaveDraft(false, false);
    }, 5000);
  };

  const handleSaveDraft = useCallback(
    async (showToast = true, redirectOnNewDraft = false) => {
      if (!loggedInUser) {
        toast.error('You must be logged in to save a draft');
        return;
      }
  
      const currentTags = tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
  
      // Optional: Remove this if you want to allow saving drafts with empty content
      const hasContent = title.trim() !== '' || content.trim() !== '';
      if (!hasContent) {
        toast.error('Cannot save draft without content');
        return;
      }
  
      setIsSaving(true);
  
      try {
        const saved = await saveDraft({
          id: blogId,
          userEmail: loggedInUser.email,
          title,
          tagline,
          importantDescription,
          content,
          tags: currentTags,
          status: 'draft',
        });
  
        if (saved && saved.id && !blogId) {
          setBlogId(saved.id);
  
          if (redirectOnNewDraft) {
            navigate(`/edit-blog/${saved.id}`, { replace: true });
          }
        }
  
        lastSavedData.current = {
          title,
          tagline,
          importantDescription,
          content,
          tags: currentTags,
        };
  
        setLastSaved(new Date());
  
        if (showToast) toast.success('Draft saved');
      } catch (error) {
        console.error('Error saving draft:', error);
        if (showToast) toast.error('Failed to save draft');
      } finally {
        setIsSaving(false);
      }
    },
    [blogId, title, tagline, importantDescription, content, tags, navigate, loggedInUser]
  );
  

  const handlePublish = () => {
    if (!loggedInUser) {
      toast.error('You must be logged in to publish');
      return;
    }

    setIsSaving(true);

    const currentTags = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    publishBlog({
      id: blogId,
      userEmail: loggedInUser.email,
      title,
      tagline,
      importantDescription,
      content,
      tags: currentTags,
      status: 'published',
    })
      .then(() => {
        toast.success('Blog published');
        alert('Blog has been published successfully!');
        navigate('/create-blog');
      })
      .catch(() => {
        toast.error('Failed to publish');
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <ToastContainer />
        <h2 style={styles.title}>{blogId ? 'Edit Blog' : 'Create New Blog'}</h2>

        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            triggerAutoSave();
          }}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Tagline"
          value={tagline}
          onChange={e => {
            setTagline(e.target.value);
            triggerAutoSave();
          }}
          style={styles.input}
        />

        <div style={styles.editorWrapper}>
          <ReactQuill
            value={content}
            onChange={val => {
              setContent(val);
              triggerAutoSave();
            }}
            style={styles.editor}
            placeholder="Write your blog content here..."
          />
        </div>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => {
            setTags(e.target.value);
            triggerAutoSave();
          }}
          style={styles.input}
        />

        <div style={styles.status}>
          {isSaving
            ? 'Saving...'
            : lastSaved
            ? `Last saved: ${lastSaved.toLocaleTimeString()}`
            : ''}
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={() => handleSaveDraft(true, true)} // show toast and redirect if new draft
            disabled={isSaving}
            style={{ ...styles.button, backgroundColor: '#a2e3f6', color: '#055f79' }}
          >
            Save as Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            style={{ ...styles.button, backgroundColor: '#a3f7bf', color: '#056b44' }}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageBackground: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #d0f0f7, #e0ffe0)',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: '850px',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
    animation: 'fadeIn 0.6s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: '#2b3d4f',
    textAlign: 'center',
  },
  input: {
    width: '96%',
    padding: '12px 15px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  editorWrapper: {
    width: '100%',
    minHeight: '300px',
    backgroundColor: '#f8fafd',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  editor: {
    height: '300px',
    border: 'none',
  },
  status: {
    textAlign: 'right',
    color: '#777',
    fontSize: '0.9rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    marginTop: '10px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background-color 0.3s ease',
    flex: 1,
  },
};

export default BlogEditor;
