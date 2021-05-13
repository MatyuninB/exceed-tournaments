const Users = require('../../db/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.newUser = (req, res) => {
  const user = {
    username, 
    password, 
    tornaments, 
    image, 
    office
  } = req.body;

  if (password) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      user.password = hash;
    });
  } else {
    res.send('ERR: no password!');
  }

  const newUser = new Users(user);

  newUser.save()
  .then(() => res.send('User ' + user.username + ' created'))
  .catch(err => {
    console.log(err);
    res.send(err._message);
  })
}