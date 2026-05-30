import mongoose, { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
  adventureId: { type: String, required: true },
  adventureTitle: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  travelDate: { type: Date, required: true },
  guests: { type: Number, required: true, default: 1 },
  totalPrice: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending' 
  }
}, {
  timestamps: true
});

const Booking = models.Booking || model('Booking', BookingSchema);

export default Booking;
