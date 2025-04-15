import express from 'express';
import Trip from '../model/trip.model.js';
import { verifyToken } from '../jwt.js';
import { getMyTrips } from '../controllers/trip.controller.js';

const router = express.Router();

router.get('/my-trips', verifyToken, getMyTrips);


function haversineDistance(loc1, loc2) {
  const toRad = (deg) => deg * (Math.PI / 180);
  const R = 3958.8; 

  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
            Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

router.post('/log-trip', verifyToken, async (req, res) => {
  try {
    const { startLocation, endLocation, transportationType } = req.body;

    const distance = haversineDistance(startLocation, endLocation);

    // Simple credit multipliers
    const multipliers = {
      bus: 1.2,
      carpool: 1.5,
      bike: 2,
      remote: 3 // fixed credit, no distance
    };

    const credits = transportationType === 'remote'
      ? multipliers.remote
      : distance * (multipliers[transportationType] || 1);

    const trip = await Trip.create({
      userId: req.user.id,
      startLocation,
      endLocation,
      transportationType,
      distance,
      creditsEarned: parseFloat(credits.toFixed(2)),
    });

    res.status(201).json({ message: "Trip logged", trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
