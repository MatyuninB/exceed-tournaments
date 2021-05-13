const mongoose = require('mongoose');
const { Schema } = mongoose;

const tournamentSchema = new Schema(
  {
    title: String,
    date: {type: Date, default: Date.now },
    users: [
      {
        username: String,
        image: {type: String, default:"https://www.meme-arsenal.com/memes/977d4bb950b8c9d8917a7da11808a63b.jpg"},
        score: {type: String, default:"-"},
        place: String,
        gitURL: String,
        office: String,
      }
    ],
    place: String,
    status: {type: Boolean, default: true}
  }
);

module.exports = Tournaments = mongoose.model('tournaments', tournamentSchema);