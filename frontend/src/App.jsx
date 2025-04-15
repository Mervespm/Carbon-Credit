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
          <Route path="dashboard/employer" element={<EmployerDashboard />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
