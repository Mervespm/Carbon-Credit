import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import '../assets/styles/layout.css';

function Layout() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
