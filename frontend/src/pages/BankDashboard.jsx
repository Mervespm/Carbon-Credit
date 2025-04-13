import React, { useEffect, useState } from 'react';

const BankDashboard = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPendingEmployers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch('http://localhost:8080/api/employers/pending', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      if (res.ok) {
        setEmployers(data);
      } else {
        setMessage(data.message || 'Unauthorized or failed to load employers');
      }
    } catch (err) {
      setMessage('Failed to load employers');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPendingEmployers();
  }, []);

  const approveEmployer = async (id) => {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`http://localhost:8080/api/employers/approve/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.ok) {
        setMessage('Employer approved successfully');
        setEmployers((prev) => prev.filter((e) => e._id !== id));
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to approve');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };
  

  return (
    <div className="bank-dashboard-container">
      <h2>Pending Employer Approvals</h2>
      {message && <p>{message}</p>}
      {loading ? (
        <p>Loading employers...</p>
      ) : employers.length === 0 ? (
        <p>No pending employers.</p>
      ) : (
        <ul>
          {employers.map((emp) => (
            <li key={emp._id} style={{ marginBottom: '1rem' }}>
              <strong>{emp.company_name}</strong> ({emp.email})<br />
              <button onClick={() => approveEmployer(emp._id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BankDashboard;
