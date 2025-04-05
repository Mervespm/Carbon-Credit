import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/home.css'; // New CSS file we'll create

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Carbon Credit Bank System</h1>
      <p className="home-description">
        This platform allows employees to accumulate carbon credits by reducing their transportation footprint. Whether through carpooling, public transportation, or working remotely, each sustainable choice earns points based on saved travel mileage. These points are verified by the employer and carbon credit bank, then converted into tradeable credits.
        <br /><br />
        Employers can track employee activity, accumulate carbon credits, and participate in a carbon credit trading market. Verified organizations gain the opportunity to sell or buy credits from other companies working toward sustainability goals.
        <br /><br />
        Together, we create a smarter, greener commute system — one trip at a time.
        </p>

      <Link to="/login" className="home-login-btn">Go to Login</Link>
    </div>
  );
}

export default Home;
