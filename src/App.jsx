import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* You can add more routes here */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
