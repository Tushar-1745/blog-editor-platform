// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { login } from '../api/UserApi';  // Directly import login function
// import { AuthContext } from '../context/AuthContext';  // Import AuthContext

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
  
//   const { login: setUser } = useContext(AuthContext);  // Get setUser function from context

//   const handleChange = (e) => {
//     setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       console.log("Attempting login with:", form);
//       const data = await login(form);
//       console.log("Login success:", data);
      
//       // Save token and user info to localStorage
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data));

//       setUser(data);  // Update AuthContext with user data
//       navigate('/');  // Redirect to homepage
//     } catch (err) {
//       setError(err.message || 'Login failed. Check your credentials.');
//     }
//   };

//   return (
//     <div style={containerStyle}>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit} style={formStyle}>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//           style={inputStyle}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           required
//           style={inputStyle}
//         />
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit" style={buttonStyle}>Login</button>
//       </form>
//       <p style={{ marginTop: '15px' }}>
//         Don't have an account? <Link to="/register">Register</Link>
//       </p>
//     </div>
//   );
// };

// // Styles (same as before)
// const containerStyle = {
//   maxWidth: '400px',
//   margin: '60px auto',
//   padding: '20px',
//   boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
//   borderRadius: '10px',
//   fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//   textAlign: 'center',
// };
// const formStyle = { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' };
// const inputStyle = { padding: '12px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' };
// const buttonStyle = { padding: '12px', fontSize: '1rem', borderRadius: '6px', border: 'none', backgroundColor: '#1abc9c', color: 'white', cursor: 'pointer', fontWeight: '600' };

// export default LoginPage;


import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../api/UserApi';  // Your API login function
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // Use login from context

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginAPI(form);  // Call API
      login(data);                        // Update context state
      localStorage.setItem('token', data.token); // Save token separately if needed
      navigate('/');                      // Redirect after login
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

const containerStyle = {
  maxWidth: '400px',
  margin: '60px auto',
  padding: '20px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginTop: '20px',
};

const inputStyle = {
  padding: '12px',
  fontSize: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '12px',
  fontSize: '1rem',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#1abc9c',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '600',
};

export default LoginPage;
