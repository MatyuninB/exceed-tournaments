const mongoose = require('mongoose');
const { Schema } = mongoose;
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema( 
  {
    username: {type: String, required: true, unique: true},
    password: { type: String, required: true },
    tournaments: [{
      tournamentId: String,
    }],
    image: {type: String, default:"https://www.meme-arsenal.com/memes/977d4bb950b8c9d8917a7da11808a63b.jpg"},
    office: { type: String, required: true },
  }
);

userSchema.plugin(uniqueValidator);
module.exports = Users = mongoose.model('users', userSchema); 