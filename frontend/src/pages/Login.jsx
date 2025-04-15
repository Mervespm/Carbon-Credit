import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/login.css'; // your custom CSS
import Logo from '../assets/images/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();

        if (data.message === "Account not approved yet") {
          setError("Your account is awaiting approval.");
          return;
        }

        localStorage.setItem("token", data.token);

        switch (data.user.role) {
          case 'employee': navigate('/dashboard/employee'); break;
          case 'employer': navigate('/dashboard/employer'); break;
          case 'bank': navigate('/dashboard/bank'); break;
          default: setError('Unknown role.'); break;
        }
      } else {
        setError('Invalid credentials, please try again.');
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
