import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './components/Layout';
import RegisterEmployee from './pages/RegisterEmployee';
import RegisterEmployer from './pages/RegisterEmployer';

import EmployeeDashboard from './pages/EmployeeDashboard';





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register/employee" element={<RegisterEmployee />} />
          <Route path="/register/employer" element={<RegisterEmployer />} />
          <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
