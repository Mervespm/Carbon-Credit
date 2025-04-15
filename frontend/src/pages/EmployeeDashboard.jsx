import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import '../assets/styles/triplogger.css';

const COLORS = ['#1F7D53', '#FF8C00', '#8884d8', '#00C49F'];

const EmployeeDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch('http://localhost:8080/api/my-trips', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTrips(data.trips);
        setTotalCredits(data.totalCredits);
      }
    };
    fetchTrips();
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
      <h3> Total Carbon Credits: <strong>{totalCredits.toFixed(2)}</strong></h3>

      <div className="mb-3 text-center">
        <button className="btn btn-primary" onClick={() => navigate('/trip')}>
          + Add New Trip
        </button>
      </div>

      <div className="row mt-4">
  {/* Pie Chart on the left */}
  <div className="col-md-6 mb-4">
    <h4 className="mb-3">Carbon Credit Distribution</h4>
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
    <h4 className="mb-3">Trip History</h4>
    <div className="trip-history-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <ul className="list-group">
        {trips.map((trip, index) => (
          <li key={index} className="list-group-item">
            <strong>{trip.transportationType}</strong> <br />
            <small>{new Date(trip.createdAt).toLocaleString()}</small><br />
            Credits: <strong>{trip.creditsEarned.toFixed(2)}</strong>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

    </div>
  );
};

export default EmployeeDashboard;