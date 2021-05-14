const mongoose = require('mongoose');
const { Schema } = mongoose;

const tournamentSchema = new Schema(
  {
    title: String,
    date: {type: Date, default: Date.now },
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
      about: String,
      rules: String,
      benchmarks: String,
    }
  }
);

module.exports = Tournaments = mongoose.model('tournaments', tournamentSchema);