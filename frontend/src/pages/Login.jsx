import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/login.css';
import Logo from '../assets/images/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        setError(data.message || 'Invalid credentials.');
        return;
      }

      if (data.message === "Your account is awaiting approval.") {
        setError("Your account is awaiting approval.");
        return;
      }

      if (data.message === "Your registration was rejected.") {
        setError("Your registration was rejected.");
        return;
      }

      switch (data.role) {
        case 'employee': navigate('/dashboard/employee'); break;
        case 'employer': navigate('/dashboard/employer'); break;
        case 'bank': navigate('/dashboard/bank'); break;
        default: setError('Unknown role.'); break;
      }

    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="container-fluid login-container d-flex justify-content-center align-items-center">
      <div className="login-card shadow p-4">
        <img src={Logo} alt="Logo" className="login-logo mb-4" />
        <h2 className="login-title mb-4">Carbon Credit Bank</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn mt-3">Login</button>

          <p className="register-text mt-4">
            Don’t have an account? <br />
            <Link to="/register/employee">Register as Employee</Link> |{' '}
            <Link to="/register/employer">Register as Employer</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
