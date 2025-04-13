import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const data = [
  { month: 'Jan', credits: 12 },
  { month: 'Feb', credits: 18 },
  { month: 'Mar', credits: 22 },
  { month: 'Apr', credits: 15 },
];

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const handleAddTrip = () => {
    navigate('/trip');
  };

  return (
    <div className="dashboard-container">
      <h2>Your Carbon Credit Dashboard</h2>

      <div style={{ width: '100%', height: 450 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Credits', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="credits" stroke="#1F7D53" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <button onClick={handleAddTrip} style={{ marginTop: '3rem', padding: '20px 30px', backgroundColor: '#1F7D53', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
        + Add Trip
      </button>
    </div>
  );
};

export default EmployeeDashboard;
