import React, { useEffect, useState } from 'react';

const BankDashboard = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPendingEmployers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employer/pending`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setEmployers(data);
      } else {
        setMessage(data.message || 'Failed to load employers');
      }
    } catch (err) {
      setMessage('Server error while loading employers');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, approve = true) => {
    const action = approve ? 'approve' : 'disapprove';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/employer/${action}/${id}`, {
        method: 'PATCH',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setEmployers((prev) => prev.filter((e) => e._id !== id));
      } else {
        setMessage(data.message || 'Failed to update employer');
      }
    } catch {
      setMessage('Server error');
    }
  };

  useEffect(() => {
    fetchPendingEmployers();
  }, []);

  return (
    <div className="container py-5">
      <div className="mb-4 p-4 rounded" style={{ backgroundColor: "var(--green-base)", color: "#fff" }}>
        <h3>Bank Admin Dashboard</h3>
        <p>Manage employer registrations below:</p>
      </div>

      {message && <div className="alert alert-info text-center">{message}</div>}

      {loading ? (
        <p className="text-center">Loading employers...</p>
      ) : employers.length === 0 ? (
        <div className="alert alert-success text-center">No pending employers.</div>
      ) : (
        <div className="card">
          <div className="card-header" style={{ backgroundColor: "var(--green-deep)", color: "#fff" }}>
            Pending Employer Approvals
          </div>
          <ul className="list-group list-group-flush">
            {employers.map((emp) => (
              <li key={emp._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{emp.company_name}</strong><br />
                  <small>{emp.email}</small>
                </div>
                <div>
                  <button className="btn btn-success btn-sm mr-2" onClick={() => handleAction(emp._id, true)}>Approve</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleAction(emp._id, false)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BankDashboard;
