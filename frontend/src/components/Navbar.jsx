import React, { useContext } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(AuthContext);  // Use loggedInUser from context

  console.log("user in navbar is", loggedInUser);

  // Check if user is logged in: loggedInUser should not be null and must have email or id
  const isLoggedIn = loggedInUser && (loggedInUser.id || loggedInUser.email);
  console.log("is logged in", isLoggedIn);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav style={navStyles.container}>
      <div style={navStyles.logo}>MyBlog</div>

      {isLoggedIn ? (
        <div
          style={navStyles.profile}
          onClick={handleProfileClick}
          title="Go to Profile"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleProfileClick(); }}
        >
          <FaUserCircle size={28} color="#555" />
        </div>
      ) : (
        <button
          style={navStyles.loginButton}
          onClick={handleLoginClick}
          aria-label="Login"
        >
          Login
        </button>
      )}
    </nav>
  );
};

const navStyles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e0e0e0',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#333',
    cursor: 'default',
  },
  profile: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#a2d2ff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    color: '#034078',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Navbar;
