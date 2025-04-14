import React, { useState, useEffect } from 'react';
import '../assets/styles/triplogger.css';

const TripLogger = () => {
  const [startLoc, setStartLoc] = useState(null);
  const [endLoc, setEndLoc] = useState(null);
  const [transportType, setTransportType] = useState('');
  const [credits, setCredits] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [officeLocation, setOfficeLocation] = useState(null);

  useEffect(() => {
    const fetchOfficeLocation = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch('http://localhost:8080/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOfficeLocation(data.officeLocation);
      } else {
        setMessage("Failed to load office location.");
      }
    };
    fetchOfficeLocation();
  }, []);

  const formatTimer = (ms) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const msPart = Math.floor((ms % 1000) / 10);
    return `${m}m ${s}s ${msPart}ms`;
  };

  useEffect(() => {
    if (!timerId) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - timerId);
    }, 100);
    return () => clearInterval(interval);
  }, [timerId]);

  const getLocation = (setter) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setMessage("Please allow location access.")
    );
  };

  const isClose = (loc1, loc2, maxDistance = 300) => {
    if (!loc1 || !loc2) return false;
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLng = toRad(loc2.lng - loc1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(loc1.lat)) *
      Math.cos(toRad(loc2.lat)) *
      Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    console.log(`Distance from end location to office: ${distance.toFixed(2)} meters`);
    return distance <= maxDistance;
  };

  const handleStart = () => {
    if (!transportType) {
      setMessage("Please select a transport type first.");
      return;
    }
    // getLocation(setStartLoc);
    setStartLoc({ lat: 26.3795, lng: 0.0913 });
    setElapsed(0);
    setSubmitted(false);
    setTimerId(Date.now());
    setMessage("Trip started. Timer is running...");
  };

  const handleEnd = async () => {
    getLocation(setEndLoc);
    clearInterval(timerId);
    setTimerId(null);

    if (!startLoc || !officeLocation) {
      setMessage("Trip failed. Missing required location data.");
      return;
    }

    setTimeout(async () => {
      if (!endLoc) {
        setMessage("End location not set yet.");
        return;
      }

      if (!isClose(endLoc, officeLocation)) {
        setMessage("You are not near your office location. Trip not accepted.");
        return;
      }

      const token = localStorage.getItem("token");
      try {
        const res = await fetch('http://localhost:8080/api/log-trip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startLocation: startLoc,
            endLocation: endLoc,
            transportationType: transportType,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setCredits(data.trip.creditsEarned);
          setSubmitted(true);
          setMessage("Trip saved successfully.");
        } else {
          setMessage(data.message || "Trip submission failed.");
        }
      } catch {
        setMessage("Server error. Try again.");
      }
    }, 1000); // Delay to ensure GPS is set
  };

  return (
    <div className="trip-logger max-w-lg mx-auto mt-5 p-4 bg-white rounded shadow text-base">
      <h2 className="text-center mb-3 text-green-900">Log Your Trip</h2>
      <p className="text-center text-muted mb-4">
        Select your transportation method and click "Start Trip". Once you arrive at the office, click "End Trip".
      </p>

      <div className="form-group">
        <label>Transportation Type</label>
        <select className="form-control" value={transportType} onChange={(e) => setTransportType(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="carpool">Carpool</option>
          <option value="bus">Bus</option>
          <option value="bike">Bike</option>
          <option value="remote">Work From Home</option>
        </select>
      </div>

      <div className="d-flex justify-content-between mt-3 mb-3">
        <button className="btn btn-success w-100 mr-2" onClick={handleStart} disabled={!transportType || timerId}>
          Start Trip
        </button>
        <button className="btn btn-secondary w-100 ml-2" onClick={handleEnd} disabled={!timerId || submitted}>
          End Trip
        </button>
      </div>

      <p className="text-center text-success font-weight-bold">
        Duration: {formatTimer(elapsed)}
      </p>

      {credits !== null && (
        <div className="alert alert-success text-center mt-4">
          Trip logged! You earned <strong>{credits}</strong> carbon credits.
        </div>
      )}

      {message && (
        <p className="text-center text-muted mt-3">{message}</p>
      )}
    </div>
  );
};

export default TripLogger;
