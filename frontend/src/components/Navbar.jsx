

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user || !user.role) return '/dashboard';

    switch (user.role.toLowerCase()) {
      case 'employee':
        navigate('/dashboard/employee');
        window.location.reload();
        break;
      case 'bank':
        navigate('/dashboard/bank');
        window.location.reload();
        break;
      case 'employer':
        navigate('/dashboard/employer');
        window.location.reload();
        break;
      default:
        navigate('/dashboard');
        window.location.reload();
        break;
    }
  };

  return (
    <div className="topnav">
      <Link to="/" className="logo">CarbonCreditBank</Link>

      {!user ? (
        <>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <>
          <Link to={getDashboardLink()}>Dashboard</Link>
          <span className="welcome">Hello, {user.first_name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default Navbar;