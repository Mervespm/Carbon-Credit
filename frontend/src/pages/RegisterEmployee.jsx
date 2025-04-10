import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/register.css';

const RegisterEmployee = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    employerCode: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Passwords don’t match.');
      return;
    }

    try {
      const res = await fetch('https://domain.com/api/register/employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          address: form.address,
          employerCode: form.employerCode
        })
      });

      if (res.ok) {
        navigate('/login');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to server.');
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>Register as Employee</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Home Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="employerCode"
          placeholder="Employer Code"
          value={form.employerCode}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterEmployee;
