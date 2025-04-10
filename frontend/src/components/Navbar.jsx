import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/navbar.css';
import Logo from '../assets/images/logo.png'; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={Logo} alt="Carbon Credit Logo" className="nav-logo" />
        <Link className="nav-title" to="/">CarbonCreditBank</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/">Contact Us</Link>
        <Link to="/">Services</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
