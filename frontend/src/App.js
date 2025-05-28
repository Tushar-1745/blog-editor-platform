// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogListPage from './pages/BlogListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BlogEditor from './components/BlogEditor';
import ViewBlog from './pages/ViewBlog';
import ProfilePage from './pages/ProfilePage';

import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BlogListPage />} />
          <Route path="/create-blog" element={<BlogEditor />} />
          <Route path="/blog-editor/:id" element={<BlogEditor />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blog/:id" element={<ViewBlog />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
