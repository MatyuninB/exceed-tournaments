const mongoose = require('mongoose');
const { Schema } = mongoose;

const tournamentSchema = new Schema(
  {
    publicID: {type: String, required: true, unique: true},
    users: [
      {
        userId: String,
        score: {type: String, default:"-"},
        gitURL: String,
        difficulty: String,
        jobStatus: String,
      }
    ],
    place: String,
    status: {type: Boolean, default: true},
    description: {
      date: {type: Date, default: Date.now },
      title: String,
      about: String,
      rules: String,
      benchmarks: String,
    }
  }
);

module.exports = Tournaments = mongoose.model('tournaments', tournamentSchema);