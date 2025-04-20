import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../assets/styles/navbar.css';

function Navbar() {
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
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [location.pathname]); 

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user || !user.role) return '/dashboard';
    
    switch (user.role.toLowerCase()) {
      case 'employee':
        return '/dashboard/employee';
      case 'bank':
        return '/dashboard/bank';
      case 'employer':
        return '/dashboard/employer';
      default:
        return '/dashboard';
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
          <Link to="/account">My Account</Link>
          <span className="welcome">Hello, {user.first_name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </>

      )}
    </div>
  );
}

export default Navbar;