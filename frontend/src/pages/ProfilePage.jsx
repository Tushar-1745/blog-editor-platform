import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { loggedInUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();  // Initialize navigate

  if (!loggedInUser) {
    return (
      <div style={containerStyle}>
        <h2>Please login to see your profile</h2>
      </div>
    );
  }

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  const initials = getInitials(loggedInUser.firstName, loggedInUser.lastName);

  const handleLogout = () => {
    logout();       // Clear user from context and localStorage
    navigate('/');  // Redirect to homepage
  };

  return (
    <div style={containerStyle}>
      <div style={avatarStyle}>{initials}</div>
      <h2>Your Profile</h2>
      <p><strong>First Name:</strong> {loggedInUser.firstName}</p>
      <p><strong>Last Name:</strong> {loggedInUser.lastName || '-'}</p>
      <p><strong>Email:</strong> {loggedInUser.email}</p>
      <p><strong>Mobile:</strong> {loggedInUser.mobile || '-'}</p>

      <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
      </button>
    </div>
  );
};

const containerStyle = {
  maxWidth: '420px',
  margin: '60px auto',
  padding: '20px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  textAlign: 'center',
};

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: '#1abc9c',
  color: 'white',
  fontSize: '2.5rem',
  fontWeight: '700',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto 20px',
  userSelect: 'none',
};

const logoutButtonStyle = {
  marginTop: '20px',
  padding: '10px 24px',
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

export default ProfilePage;
