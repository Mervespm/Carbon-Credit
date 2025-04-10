import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', credits: 12 },
  { month: 'Feb', credits: 18 },
  { month: 'Mar', credits: 22 },
  { month: 'Apr', credits: 15 },
];

const EmployeeDashboard = () => {
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
    </div>
  );
};

export default EmployeeDashboard;
