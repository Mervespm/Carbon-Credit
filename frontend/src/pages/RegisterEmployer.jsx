import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/register.css';
import Logo from '../assets/images/logo.png';

const RegisterEmployer = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    company_name: '',
    first_name: '',
    last_name: '',
    user_type: 'employer',
    officeLocation: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const continueStep = () => {
    if (!form.email || !form.password || !form.confirmPassword || !form.company_name) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setStep(2);
  };

  const getOfficeLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          officeLocation: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }
        }));
        toast.success('Office location set!');
      },
      () => setError('Please allow location access.')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.officeLocation) {
      setError('Please set your office location.');
      return;
    }
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setStep(1); 
        setError(data.message || 'Registration failed.');
        return;
      }
  
      toast.success('Registration submitted. Please wait for approval.');
      setTimeout(() => navigate('/login'), 2000);
  
    } catch {
      setStep(1); 
      setError('Server error. Try again.');
    }
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="register-card p-4 shadow w-100" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <img src={Logo} alt="Logo" className="login-logo mb-2" />
          <h2 className="login-title">Employer Registration</h2>
        </div>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" className="form-control" value={form.confirmPassword} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Company Name</label>
                <input type="text" name="company_name" className="form-control" value={form.company_name} onChange={handleChange} required />
              </div>

              <button type="button" className="btn login-btn btn-block mt-2" onClick={continueStep}>
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="first_name" className="form-control" value={form.first_name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="last_name" className="form-control" value={form.last_name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={getOfficeLocation}>
                  Set Office Location (Use My Current Location)
                </button>
              </div>

              {form.officeLocation && (
                <p className="text-muted text-center mt-2">
                  Office Location Set: ({form.officeLocation.lat.toFixed(3)}, {form.officeLocation.lng.toFixed(3)})
                </p>
              )}

              <button type="submit" className="btn login-btn btn-block mt-2" disabled={checking}>
                {checking ? "Registering..." : "Register"}
              </button>

            </>
          )}
        </form>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default RegisterEmployer;
