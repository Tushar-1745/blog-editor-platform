import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/UserApi';  // ✅ Import register directly

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      setLoading(true);
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });
      setLoading(false);
      alert('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={formStyle}>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          style={inputStyle}
          disabled={loading}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          style={inputStyle}
          disabled={loading}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
          disabled={loading}
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={handleChange}
          style={inputStyle}
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
          disabled={loading}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          style={inputStyle}
          disabled={loading}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '15px' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
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

export default RegisterPage;
