import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../assets/styles/layout.css';

const Layout = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

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

  const hideSidebar = ['/login', '/', '/register/employee', '/register/employer'].includes(location.pathname);

  return (
    <>
      <Navbar />
      {!hideSidebar && user ? (
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1 p-4">
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="page-container">
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Layout;
