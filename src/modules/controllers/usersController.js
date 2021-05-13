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

  await bcrypt.hash(password, saltRounds, (err, hash) => {
    user.password = hash;

    const newUser = new Users(user);
    newUser.save()
    .then(() => res.send('User ' + user.username + ' created'))
    .catch(err => {
      console.log(err);
      res.send(err._message);
    });
  });
 
  

  
}