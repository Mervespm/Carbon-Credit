import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/triplogger.css';

const TripLogger = () => {
  const [tripType, setTripType] = useState('');
  const [transportType, setTransportType] = useState('');
  const [startLoc, setStartLoc] = useState(null);
  const [endLoc, setEndLoc] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [homeLocation, setHomeLocation] = useState(null);
  const [officeLocation, setOfficeLocation] = useState(null);
  const [message, setMessage] = useState('');
  const [distance, setDistance] = useState(null);
  const [credits, setCredits] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        credentials: 'include'
      });
      const data = await res.json();
      setHomeLocation(data.homeLocation);
      setOfficeLocation(data.officeLocation);
    };
    fetchLocations();
  }, []);

  const getLocation = () => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err.message)
    );
  });

  const calculateDistanceMiles = (a, b) => {
    const toRad = deg => deg * Math.PI / 180;
    const R = 3958.8; // miles
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const aVal = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    return R * c;
  };

  const isClose = (a, b, threshold = 300) => {
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371000;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const aVal = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    return R * c < threshold;
  };

  const getCreditsPerMile = (method) => {
    switch (method) {
      case 'carpool': return 2;
      case 'bus': return 3;
      case 'remote': return 20;
      default: return 0;
    }
  };

  const handleStartTrip = async () => {
    if (!tripType || !transportType) {
      setMessage("Please select trip type and transport method.");
      return;
    }

    try {
      const location = await getLocation();
      setStartLoc({ lat: 26.3795, lng: -60.0913 });
      const now = Date.now();
      setStartTime(now);
      setMessage("Trip started. Please continue your journey and click 'End Trip' when done.");
    } catch (err) {
      setMessage("Could not get location: " + err);
    }
  };

  const handleEndTrip = async () => {
    if (!startLoc || !startTime) {
      setMessage("Trip has not started yet.");
      return;
    }

    setSubmitting(true);

    try {
      const location = await getLocation();
      setEndLoc(location);
      const now = Date.now();
      setEndTime(now);
      const duration = Math.round((now - startTime) / 60000); 
      const miles = calculateDistanceMiles(startLoc, location);
      setDistance(miles.toFixed(2));
      const isWorkTrip = tripType === 'work';
      const month = new Date(startTime).toISOString().slice(0, 7);

      if (isWorkTrip) {
        const validRoute =
          (isClose(startLoc, homeLocation) && isClose(location, officeLocation)) ||
          (isClose(startLoc, officeLocation) && isClose(location, homeLocation));

        if (!validRoute) {
          setMessage("Work trip must be between home and office.");
          setSubmitting(false);
          setTimeout(() => navigate('/dashboard/employee'), 10000);
          return;
        }
      }

      const creditsEarned = transportType === 'remote'
        ? getCreditsPerMile('remote')
        : Math.round(miles * getCreditsPerMile(transportType));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/trip/log-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          startLocation: startLoc,
          endLocation: location,
          transportationType: transportType,
          startTime,
          endTime: now,
          durationMinutes: duration,
          isWorkTrip,
          month,
          distance: miles
        })
      });
        

      const data = await res.json();

      if (res.ok) {
        setCredits(data.trip.creditsEarned);
        setMessage(`Trip complete! You earned ${data.trip.creditsEarned} credits.`);
        setTimeout(() => navigate('/dashboard/employee'), 10000);
      } else {
        setMessage(data.message || "Failed to log trip.");
      }

    } catch (err) {
      setMessage("Error ending trip: " + err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-success text-center mb-4">Log Your Trip</h2>

      <div className="form-group mb-3">
        <label>Trip Type</label>
        <select className="form-control" value={tripType} onChange={(e) => setTripType(e.target.value)}>
          <option value="">-- Select Trip Type --</option>
          <option value="work">Work Trip (Home ↔ Office)</option>
          <option value="other">Other Trip</option>
        </select>
      </div>

      <div className="form-group mb-3">
        <label>Transportation Method</label>
        <select className="form-control" value={transportType} onChange={(e) => setTransportType(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="carpool">Carpool</option>
          <option value="bus">Public Transport</option>
          <option value="remote">Work From Home</option>
        </select>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-outline-success w-100 mr-2" onClick={handleStartTrip} disabled={submitting || startTime}>
          Start Trip
        </button>
        <button className="btn btn-outline-primary w-100 ml-2" onClick={handleEndTrip} disabled={!startTime || submitting || credits !== null}>
          End Trip
        </button>
      </div>

      <div className="location-box text-center mt-3">
      {startLoc && endLoc && (
        <div className="text-center mt-3">
          <h6>Start Location</h6>
          <p>Lat: {startLoc.lat.toFixed(5)}, Lng: {startLoc.lng.toFixed(5)}</p>
          <h6>End Location</h6>
          <p>Lat: {endLoc.lat.toFixed(5)}, Lng: {endLoc.lng.toFixed(5)}</p>
        </div>
      )}

      </div>

      


      {credits !== null && (
      <div className="alert alert-success mt-4 text-center">
        <h4 className="alert-heading">Trip Recorded!</h4>
        <p>You earned <strong>{credits}</strong> carbon credits.</p>
        {distance !== null && distance > 0 && (
          <p className="mb-0">Distance: {distance} miles</p>
        )}
      </div>
)}

{message && !credits && (
  <div className="alert alert-info mt-4 text-center">
    {message}
  </div>
)}

<div className="card mt-4">
  <div className="card-header bg-light">
    <h5 className="mb-0">Carbon Credits Information</h5>
  </div>
  <div className="card-body">
    <h6>How Credits Are Earned</h6>
    <ul className="mb-4">
      <li>Carpool: 2 credits per mile saved</li>
      <li>Public Transport: 3 credits per mile saved</li>
      <li>Work From Home: Fixed 20 credits</li>
    </ul>
    
    <h6>Monthly Driving Calculation</h6>
    <p>An employee is expected to drive approximately 1,000 miles per month for non-work trips. Any reduction in this through alternative transportation methods earns carbon credits.</p>
  </div>
</div>
    </div>
  );
};

export default TripLogger;
