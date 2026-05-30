import mongoose, { Schema, model, models } from 'mongoose';

const AdventureSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  difficulty: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Himalayan', 'Desert', 'Snow', 'Jungle', 'Camping'],
    required: true 
  },
  highlights: [{ type: String }],
  itinerary: [{
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  }]
}, {
  timestamps: true
});

const Adventure = models.Adventure || model('Adventure', AdventureSchema);

export default Adventure;
