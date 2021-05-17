const mongoose = require('mongoose');
const { Schema } = mongoose;

const tournamentSchema = new Schema(
  {
    publicID: {type: String, required: true, unique: true},
    users: [
      {
        userId: {type:String, unique: true},
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
      rules: Array,
      benchmarks: Array,
      video: String,
    }
  }
);

module.exports = Tournaments = mongoose.model('tournaments', tournamentSchema);