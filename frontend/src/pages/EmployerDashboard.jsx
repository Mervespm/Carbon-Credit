import React, { useEffect, useState } from 'react';
import '../assets/styles/dashboard.css';

const EmployerDashboard = () => {
  const [employer, setEmployer] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res1 = await fetch(`${import.meta.env.VITE_API_URL}/me`, { credentials: 'include' });
    const data1 = await res1.json();
    setEmployer(data1);

    const res2 = await fetch(`${import.meta.env.VITE_API_URL}/employer/employees`, { credentials: 'include' });
    const data2 = await res2.json();
    setEmployees(data2);

    const res3 = await fetch(`${import.meta.env.VITE_API_URL}/trip/employer/credits`, { credentials: 'include' });
    const data3 = await res3.json();
    setCredits(data3.totalCompanyCredits);

    setLoading(false);
  };

  const toggleApproval = async (id, approve = true) => {
    const route = approve ? 'approve' : 'disapprove';
    await fetch(`${import.meta.env.VITE_API_URL}/employer/employees/${route}/${id}`, {
      method: 'PATCH',
      credentials: 'include'
    });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading dashboard...</p>;

  return (
    <div className="container py-5">
      <div className="mb-4 p-4 rounded" style={{ backgroundColor: "var(--green-base)", color: "#fff" }}>
        <h3>Welcome, {employer.first_name}</h3>
        <p className="mb-1">Company: <strong>{employer.company}</strong></p>
        <p className="mb-1">Company Code: <strong>{employer.company_code}</strong></p>
        <p>Total Company Carbon Credits: <strong>{credits.toFixed(2)}</strong></p>
      </div>

      <div className="card shadow-sm">
        <div className="card-header" style={{ backgroundColor: "var(--green-deep)", color: "#fff" }}>
          <h5 className="mb-0">Employees</h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-bordered table-hover mb-0">
            <thead className="thead-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.first_name} {emp.last_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.isApproved ? 'Approved' : 'Pending'}</td>
                  <td>
                    {emp.isApproved ? (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => toggleApproval(emp._id, false)}>
                        Disapprove
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-outline-success" onClick={() => toggleApproval(emp._id, true)}>
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-3">No employees registered.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
