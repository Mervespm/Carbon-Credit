import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
    navigate('/login');
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'employee': return '/dashboard/employee';
      case 'employer': return '/dashboard/employer';
      case 'bank': return '/dashboard/bank';
      default: return '/';
    }
  };

  if (!user) return null;

  return (
    <div className="sidebar bg-dark text-white p-3" style={{ minHeight: '100vh', width: '220px' }}>
      <h4 className="text-white mb-4">Welcome, {user.first_name}</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === getDashboardPath() ? 'active' : ''} text-white`} to={getDashboardPath()}>
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === '/me' ? 'active' : ''} text-white`} to="/me">
            Account
          </Link>
        </li>
        {user.role === 'employee' && (
          <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/trip' ? 'active' : ''} text-white`} to="/trip">
              Log Trip
            </Link>
          </li>
        )}
        <li className="nav-item mt-3">
          <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
