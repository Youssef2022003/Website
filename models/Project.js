const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeneratedProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
  },
  materials: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('GeneratedProject', GeneratedProjectSchema);
