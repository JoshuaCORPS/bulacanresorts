const mongoose = require('mongoose');
const slugify = require('slugify');

const resortSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please provide the Resort name.'],
    minlength: [8, 'Resort name should have atleast 8 characters above.']
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Please provide the Resort summary info.']
  },
  description: {
    type: String,
    required: [true, 'Please provide the Resort description.']
  },
  imageCover: {
    type: String,
    required: [true, 'Please provide the Resort image.']
  },
  price: {
    type: [Number],
    required: [true, 'Please provide the Resort Prices']
  },
  operationHours: {
    type: [String],
    required: [true, 'Please provide the Resort operation hours.']
  },
  daysOfOperation: {
    type: String,
    default: 'Monday to Sunday'
  },
  location: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      description: String
    }
  ],
  address: {
    type: String,
    required: [true, 'Please provide the Resort Address.']
  },
  slug: String,
  images: [String],
  website: String,
  email: String,
  contactNumbers: [String],
  socialMedia: String
});

resortSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Resort = mongoose.model('Resort', resortSchema);

module.exports = Resort;
