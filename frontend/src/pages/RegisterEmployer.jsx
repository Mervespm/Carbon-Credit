import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/register.css';
import Logo from '../assets/images/logo.png';

const RegisterEmployer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 'employer',
    company_name: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!form.company_name.trim()) {
      setError('Company name is required.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registration submitted. Your account will be reviewed by the Carbon Credit Bank. You will be able to log in once it is approved.');
      
        setTimeout(() => navigate('/login'), 5000);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="register-card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <img src={Logo} alt="Logo" className="login-logo mb-3" />
          <h2 className="login-title mb-1">Employer Registration</h2>
          <p className="text-muted small">Enter your company and contact details to register.</p>
        </div>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" className="form-control" name="first_name" value={form.first_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input type="text" className="form-control" name="last_name" value={form.last_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Company Name <span className="text-danger">*</span></label>
            <input type="text" className="form-control" name="company_name" value={form.company_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-block login-btn mt-3">Register</button>
        </form>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default RegisterEmployer;
