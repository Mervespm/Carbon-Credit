<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './components/Layout';
import RegisterEmployee from './pages/RegisterEmployee';
import RegisterEmployer from './pages/RegisterEmployer';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TripLogger from './pages/TripLogger';
import BankDashboard from './pages/BankDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EmployerDashboard from './pages/EmployerDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register/employee" element={<RegisterEmployee />} />
          <Route path="register/employer" element={<RegisterEmployer />} />
          <Route path="trip" element={
            <ProtectedRoute>
              <TripLogger />
            </ProtectedRoute>
          } />

          <Route path="dashboard/employee" element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          } />

          <Route path="dashboard/bank" element={
            <ProtectedRoute requiredRole="bank">
              <BankDashboard />
            </ProtectedRoute>
          } />
          <Route path="dashboard/employer" element={
            <ProtectedRoute requiredRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          } />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
>>>>>>> merv
