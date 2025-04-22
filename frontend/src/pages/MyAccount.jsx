import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const MyAccount = () => {
  const [form, setForm] = useState({ first_name: '', last_name: '', homeLocation: null });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          homeLocation: data.homeLocation || null,
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          homeLocation: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }));
        toast.success('Home location updated');
      },
      () => toast.error('Location permission denied')
    );
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/me/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) toast.success('Profile updated');
      else toast.error(data.message || 'Update failed');
    } catch {
      toast.error('Server error');
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete your account?');
    if (!confirm) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Account deleted');
        logout(); // from context
        setTimeout(() => navigate('/login'), 2000);
      } else toast.error(data.message);
    } catch {
      toast.error('Server error');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4">My Account</h3>

      <div className="form-group">
        <label>First Name</label>
        <input name="first_name" className="form-control" value={form.first_name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input name="last_name" className="form-control" value={form.last_name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Home Location</label>
        {form.homeLocation ? (
          <p className="text-muted">
            ({form.homeLocation.lat.toFixed(3)}, {form.homeLocation.lng.toFixed(3)})
          </p>
        ) : (
          <p className="text-muted">Not set</p>
        )}
        <button className="btn btn-outline-secondary" onClick={updateLocation}>Update Location</button>
      </div>

      <button className="btn btn-success mt-3 mr-2" onClick={handleSave}>Save Changes</button>
      <button className="btn btn-danger mt-3 ml-2" onClick={handleDelete}>Delete My Account</button>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default MyAccount;
