const Users = require('../../db/users');
const bcrypt = require('bcrypt');
const generateToken = require('../auth/generateToken');
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
      .then(() => res.sendStatus(201))
      .catch(err => {
        console.log(err);
        res.send(err._message);
      });
    });
  } else {
    res.status(400).send('ERR: password break the rules');
  }
}

module.exports.userLogin = (req, res) => {
  const {password, username} = req.body;

  Users.findOne({username})
  .then(result => {
    bcrypt.compare(password, result.password, (err, checked) => {
      if (checked) {
        console.log({username: result.username, _id: result._id})
        let token = generateToken({username: result.username, _id: result._id});
        res.status(200).send({token: token});
      } else {
        res.status(400).send('wrong pass');
      }
    });
  })
  .catch(err => res.status(404).send("User not found!"));
}