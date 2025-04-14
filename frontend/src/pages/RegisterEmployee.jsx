import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/register.css';

const RegisterEmployee = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [checkingCode, setCheckingCode] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    company_code: '',
    first_name: '',
    last_name: '',
    user_type: 'employee',
    homeLocation: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateCompanyCode = async () => {
    if (!form.company_code) return setError('Company code is required.');
    setCheckingCode(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/validate-company-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_code: form.company_code })
      });

      const data = await res.json();
      setCheckingCode(false);

      if (res.ok) {
        toast.success('Company code is valid!');
        setStep(2);
      } else {
        setError(data.message || 'Invalid company code.');
      }
    } catch {
      setCheckingCode(false);
      setError('Server error. Try again.');
    }
  };

  const getHomeLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          homeLocation: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }
        }));
        toast.success('Home location set!');
      },
      () => setError('Please allow location access.')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (!form.homeLocation) return setError('Please set your home location.');

    try {
      const res = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Account created. Awaiting approval.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch {
      setError('Server error. Try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="register-card p-4 shadow w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Employee Registration</h2>
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
                <label>Company Code</label>
                <input type="text" name="company_code" className="form-control" value={form.company_code} onChange={handleChange} required />
              </div>

              <button type="button" className="btn login-btn btn-block" onClick={validateCompanyCode} disabled={checkingCode}>
                {checkingCode ? 'Checking...' : 'Continue'}
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
                <button type="button" className="btn btn-outline-secondary w-100" onClick={getHomeLocation}>
                  Set Home Location (Use My Current Location)
                </button>
              </div>

              <button type="submit" className="btn login-btn btn-block mt-2">Register</button>
            </>
          )}
        </form>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default RegisterEmployee;
