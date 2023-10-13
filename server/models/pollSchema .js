const mongoose = require('mongoose');

const pollOptionSchema = new mongoose.Schema({
  option: String,
  votes: Number,
});

const pollSchema = new mongoose.Schema({
  question: String,
  options: [pollOptionSchema],
  visibility: String,
  duration: Number,
  durationUnit: String,
  isOpen: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Poll', pollSchema);
