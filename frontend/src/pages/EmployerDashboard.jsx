import React, { useEffect, useState } from 'react';
import '../assets/styles/dashboard.css';

const EmployerDashboard = () => {
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployer = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/employer/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setEmployer(data);
      setLoading(false);
    };

    fetchEmployer();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading dashboard...</p>;

  return (
    <div className="employer-dashboard">
      <h2>Welcome, {employer.first_name}!</h2>

      {!employer.isApproved ? (
        <div className="status-box pending">
          <p>Your registration is <strong>pending approval</strong> by the Carbon Credit Bank.</p>
          <p>Once approved, your company code will appear here.</p>
        </div>
      ) : (
        <div className="status-box approved">
          <p>Your account is <strong>approved</strong> ✅</p>
          <p>Your company code is: <strong>{employer.company_code}</strong></p>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
