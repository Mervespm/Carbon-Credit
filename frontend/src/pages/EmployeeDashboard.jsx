import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import '../assets/styles/triplogger.css';

const COLORS = ['#1F7D53', '#FF8C00', '#8884d8', '#00C49F'];

const EmployeeDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [summary, setSummary] = useState(null);
  const [lifetime, setLifetime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) navigate("/login");
      } catch (err) {
        navigate("/login");
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/trip/my-trips`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setTrips(data.trips);
        setTotalCredits(data.totalCredits);
      }
    };
    fetchTrips();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/trip/monthly-summary`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setSummary(data);
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchLifetime = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/trip/total-summary`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setLifetime(data);
    };
    fetchLifetime();
  }, []);

  const creditData = trips.reduce((acc, trip) => {
    const type = trip.transportationType;
    const credits = trip.creditsEarned || 0;
    acc[type] = (acc[type] || 0) + credits;
    return acc;
  }, {});

  const chartData = Object.entries(creditData).map(([type, credits]) => ({
    name: type,
    value: Number(credits.toFixed(2))
  }));

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Welcome to Your Dashboard</h1>
      <h4>Total Carbon Credits: <strong>{totalCredits.toFixed(2)}</strong></h4>

      {summary && (
        <div className="alert alert-info mt-4">
          <h5>Monthly Driving Summary ({summary.month})</h5>
          <p><strong>Work Trip Miles:</strong> {summary.workMiles} mi</p>
          <p><strong>Other Trip Miles:</strong> {summary.otherMiles} mi</p>
          <p><strong>Expected Limit:</strong> 1000 mi</p>
        </div>
      )}

      {lifetime && (
        <div className="alert alert-secondary mt-3">
          <h5>Total Trip Summary</h5>
          <p><strong>Total Miles:</strong> {lifetime.totalMiles} mi</p>
          <p><strong>Work Miles:</strong> {lifetime.workMiles} mi</p>
          <p><strong>Other Miles:</strong> {lifetime.otherMiles} mi</p>
        </div>
      )}

      <div className="text-center mt-3">
        <button className="btn btn-success" onClick={() => navigate('/trip')}>
          + Log New Trip
        </button>
      </div>

      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <h5 className="mb-3">Carbon Credit Breakdown</h5>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-6">
          <h5 className="mb-3">Your Trip History</h5>
          <div className="trip-history-scroll" style={{ maxHeight: '320px', overflowY: 'auto' }}>
            <ul className="list-group">
              {trips.map((trip, index) => (
                <li key={index} className="list-group-item small">
                  <strong>{trip.transportationType}</strong> | {trip.distance.toFixed(2)} miles<br />
                  <small>{new Date(trip.createdAt).toLocaleString()}</small><br />
                  <strong>Credits:</strong> {trip.creditsEarned.toFixed(2)}<br />
                  <small>
                    Start: ({trip.startLocation?.lat.toFixed(2)}, {trip.startLocation?.lng.toFixed(2)})<br />
                    End: ({trip.endLocation?.lat.toFixed(2)}, {trip.endLocation?.lng.toFixed(2)})
                  </small>
                </li>
              ))}
              {trips.length === 0 && (
                <li className="list-group-item text-center text-muted">
                  No trips logged yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
