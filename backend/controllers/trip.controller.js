import Trip from '../model/trip.model.js';
import Account from '../model/account.model.js';


const haversineDistance = (loc1, loc2) => {
  const toRad = (deg) => deg * (Math.PI / 180);
  const R = 3958.8; // miles

  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
            Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const isNear = (a, b, threshold = 0.25) => {
  return haversineDistance(a, b) < threshold;
};

export const logTrip = async (req, res) => {
  try {
    const {
      startLocation,
      endLocation,
      transportationType,
      startTime,
      endTime,
      durationMinutes,
      isWorkTrip,
      month
    } = req.body;

    const userId = req.session.user.user_id;

    const user = await Account.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const distance = haversineDistance(startLocation, endLocation);
    const multipliers = {
      bus: 3,
      carpool: 2,
      remote: 20
    };

    let creditsEarned = 0;

    if (transportationType === "remote") {
      creditsEarned = multipliers.remote;
    } else if (["bus", "carpool"].includes(transportationType)) {
      creditsEarned = distance * multipliers[transportationType];
    }

    const trip = await Trip.create({
      userId,
      startLocation,
      endLocation,
      transportationType,
      distance,
      creditsEarned: parseFloat(creditsEarned.toFixed(2)),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      durationMinutes,
      isWorkTrip,
      month
    });

    res.status(201).json({ message: "Trip logged", trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const totalCredits = trips.reduce((sum, t) => sum + (t.creditsEarned || 0), 0);
    res.status(200).json({ trips, totalCredits });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};


export const getEmployerEmployeeCredits = async (req, res) => {
  try {
    const employer = await Account.findById(req.session.user.user_id);
    if (!employer || employer.user_type !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const employees = await Account.find({ company_code: employer.company_code, user_type: "employee" });

    const results = [];

    for (const emp of employees) {
      const trips = await Trip.find({ userId: emp._id });
      const total = trips.reduce((sum, t) => sum + (t.creditsEarned || 0), 0);
      results.push({
        employee: `${emp.first_name} ${emp.last_name}`,
        email: emp.email,
        totalCredits: total
      });
    }

    const totalCompanyCredits = results.reduce((sum, e) => sum + e.totalCredits, 0);

    res.status(200).json({ employees: results, totalCompanyCredits });
  } catch (err) {
    res.status(500).json({ message: "Failed to load employee credits" });
  }
};
export const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const month = new Date().toISOString().slice(0, 7); // e.g., '2025-04'

    const trips = await Trip.find({ userId, month });

    let workMiles = 0;
    let otherMiles = 0;
    let totalCredits = 0;

    for (const trip of trips) {
      if (trip.isWorkTrip) workMiles += trip.distance || 0;
      else otherMiles += trip.distance || 0;
      totalCredits += trip.creditsEarned || 0;
    }

    const expected = 1000;
    const savedMiles = Math.max(0, expected - otherMiles);

    res.status(200).json({
      month,
      workMiles: workMiles.toFixed(2),
      otherMiles: otherMiles.toFixed(2),
      savedMiles: savedMiles.toFixed(2),
      totalCredits: totalCredits.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load monthly summary' });
  }
};
