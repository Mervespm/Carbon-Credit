import Trip from '../model/trip.model.js';

export const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const totalCredits = trips.reduce((sum, t) => sum + (t.creditsEarned || 0), 0);
    res.status(200).json({ trips, totalCredits });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};