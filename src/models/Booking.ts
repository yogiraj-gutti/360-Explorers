import mongoose, { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
  // Customer Information
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },

  // Booking Information
  bookingId: { type: String, required: true, unique: true },
  razorpayOrderId: { type: String },
  packageId: { type: String, required: true },
  packageName: { type: String, required: true },
  packagePrice: { type: Number, required: true },
  travelersCount: { type: Number, required: true, default: 1 },
  travelDate: { type: Date, required: true },
  returnDate: { type: Date },
  specialRequests: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'confirmed', 'completed', 'cancelled'],
    default: 'pending' 
  },

  // Payment Information
  paymentId: { type: String },
  transactionId: { type: String },
  paymentGateway: { type: String, default: 'Razorpay' },
  paymentMethod: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid', 'failed', 'refunded'],
    default: 'unpaid' 
  },
  paymentAmount: { type: Number },
  paymentDate: { type: Date },
  invoiceNumber: { type: String },

  // System Information
  ipAddress: { type: String },
  userId: { type: String }, // For future auth integration
}, {
  timestamps: true
});

const Booking = models.Booking || model('Booking', BookingSchema);

export default Booking;
