import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../assets/styles/login.css";
import Logo from '../assets/images/logo.png'; // Import your logo

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginUrl = 'https://domain.com/api/login';

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/employee');
      } else {
        setError('Invalid credentials, please try again.');
      }
    } catch (err) {
      setError('An error occurred, please try again.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to bottom right, #6A9C89, #ACB6E5)', // gradient here

        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <div className="login-card">
        <img src={Logo} alt="Logo" className="login-logo" /> {/* Logo here */}
        <h2 className="login-title">Carbon Credit Bank</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>

          <p className="register-text">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
