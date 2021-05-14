const Users = require('../../db/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.newUser = async(req, res) => {
  const {
    password,
    username,  
    tornaments, 
    image, 
    office
  } = req.body;
  const user = {
    username,  
    tornaments, 
    image, 
    office
  }

  if (/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/.test(password)) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      user.password = hash;

      const newUser = new Users(user);
      newUser.save()
      .then(() => res.send('User ' + user.username + ' created'))
      .catch(err => {
        console.log(err);
        res.send(err._message);
      });
    });
  } else {
    res.send('ERR: password break the rules');
  }
}