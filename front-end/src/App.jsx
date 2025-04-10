import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './components/Layout';
import RegisterEmployee from './pages/RegisterEmployee';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register/employee" element={<RegisterEmployee />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
