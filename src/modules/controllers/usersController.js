const Users = require('../../db/users');
const bcrypt = require('bcrypt');
const generateToken = require('../auth/generateToken');
const dotenv = require('dotenv').config();
const saltRounds = 10;


module.exports.newUser = async(req, res) => {
  const {
    password,
    username,  
    tornaments, 
    image, 
    office,
    fullname,
  } = req.body;
  const user = {
    username,  
    tornaments, 
    image, 
    office
  }

  if (/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/.test(password)) {
    console.log(saltRounds)
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if(err) {
        console.log(err);
      } else {
        user.password = hash;
        console.log(user.password);

        const newUser = new Users(user);
        newUser.save()
        .then(() => res.sendStatus(201))
        .catch(err => {
          console.log(err);
          res.send(err._message);
        });
      }
    });
  } else {
    res.status(400).send('ERR: password break the rules');
  }
}

module.exports.userLogin = (req, res) => {
  const { password, username } = req.body;

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

module.exports.userUpdate = (req, res) => {
  const { _id } = req.user;
  const { image, office, fullname } = req.body
  
  Users
  .updateOne({ _id }, {office, fullname})
  .then(() => res.sendStatus(202))
  .catch(err => {
    console.log(err);
    res.sendStatus(404);
  });
}

module.exports.imageHandler = async(req, res) => {
  const { _id } = req.user
  const path = Object.values(req.files)[0].path;
  cloudinary.v2.uploader.upload(path, { public_id: `exceed${_id}` })
  .then(result => Users.updateOne( {_id}, { image: result.url })
  .then(() => res.sendStatus(200))
  .catch(err => res.status(404).send(err)))
  .catch(err => res.status(404).send(err));
}