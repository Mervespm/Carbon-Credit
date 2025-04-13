import React, { useState, useEffect } from 'react';

const TripLogger = () => {
  const [startLoc, setStartLoc] = useState(null);
  const [endLoc, setEndLoc] = useState(null);
  const [transportType, setTransportType] = useState('');
  const [credits, setCredits] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
      (err) => {
        console.error(err);
        setMessage('Please allow location access.');
      }
    );
  };

  const handleStart = () => {
    if (!transportType) {
      setMessage("Please select a transport type first.");
      return;
    }

    getLocation(setStartLoc);
    setElapsed(0);
    setSubmitted(false);
    setTimerId(Date.now());
    setMessage("Trip started. Timer is running...");
  };

  const handleEnd = async () => {
    getLocation(setEndLoc);
    clearInterval(timerId);
    setTimerId(null);

    if (!startLoc) {
      setMessage("Start location not set.");
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
        setMessage("Trip saved!");
      } else {
        setMessage(data.message || "Submission failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  };

  const canStart = transportType && !timerId;
  const canEnd = timerId && !submitted;

  return (
    <div className="trip-logger max-w-lg mx-auto mt-8 p-8 bg-white rounded-2xl shadow-xl text-base">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-900">Trip Logging</h2>
      <p className="text-center text-gray-600 mb-6">
        To begin logging a trip, please select your transportation method and click "Start Trip".
        When you arrive, click "End Trip" to complete and calculate your carbon credits.
      </p>
  
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-800 mb-2">Transportation Method</label>
        <select
          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-lg"
          value={transportType}
          onChange={(e) => setTransportType(e.target.value)}
        >
          <option value="">-- Select Method --</option>
          <option value="carpool">Carpool</option>
          <option value="bus">Bus</option>
          <option value="bike">Bike</option>
          <option value="remote">Work From Home</option>
        </select>
      </div>
  
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl text-lg font-semibold disabled:opacity-50"
          onClick={handleStart}
          disabled={!canStart}
        >
          Start Trip
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl text-lg font-semibold disabled:opacity-50"
          onClick={handleEnd}
          disabled={!canEnd}
        >
          End Trip
        </button>
      </div>
  
      <p className="text-xl text-center font-mono mb-4 text-green-800">
        Trip Duration: {formatTimer(elapsed)}
      </p>
  
      {startLoc && endLoc && (
        <div className="text-center text-gray-700 text-sm mb-6">
          <p>Start Location: {startLoc.lat.toFixed(4)}, {startLoc.lng.toFixed(4)}</p>
          <p>End Location: {endLoc.lat.toFixed(4)}, {endLoc.lng.toFixed(4)}</p>
        </div>
      )}
  
      {credits !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-xl text-center text-green-800 font-medium text-lg">
          You earned <strong>{credits}</strong> carbon credits.
        </div>
      )}
  
      {message && (
        <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
  
};

export default TripLogger;
