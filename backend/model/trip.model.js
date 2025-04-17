import mongoose from "mongoose";

const tripSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  startLocation: {
    lat: Number,
    lng: Number
  },
  endLocation: {
    lat: Number,
    lng: Number
  },
  transportationType: {
    type: String,
    enum: ['bus', 'carpool', 'bike', 'remote'],
    required: true
  },
  distance: Number,
  creditsEarned: Number,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  isWorkTrip: { type: Boolean, required: true },
  month: { type: String, required: true }, // Format: 'YYYY-MM'
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Trip = mongoose.model("Trip", tripSchema);
export default Trip;
