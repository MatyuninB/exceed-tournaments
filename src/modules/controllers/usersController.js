const Users = require('../../db/users');
const Tournaments = require('../../db/tournaments');
const bcrypt = require('bcrypt');
const generateToken = require('../auth/generateToken');
const cloudinary = require('cloudinary');
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
    role
  } = req.body;
  const user = {
    username,  
    tornaments, 
    image, 
    office,
    fullname,
    role
  }

  if (/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/.test(password)) {
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
    res.status(500).send('ERR: password must contain 6 char including upper and lower case letters and numbers');
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

module.exports.userInfo = (req, res) => {
  Users.findOne({ username : req.user.username })
  .then((responce) => {
    let tmp = Object.assign({}, responce)._doc;
    delete tmp.password;
    res.send(tmp);
  })
  .catch((err) => res.status(404).send(err));
}

module.exports.imageHandler = async(req, res) => {
  const path = Object.values(req.files)[0].path;
  const username = Object.values(req.files)[0].fieldName;
  console.log(path, username)
  cloudinary.v2.uploader.upload(path, { public_id: `exceed/exceed${username}` })
  .then(result => {
    Users.updateOne({username}, {'image' : result.url})
    .catch(err => console.log(err))
  })
  .then(() => res.sendStatus(200))
  .catch(err => res.status(404).send(err))
  .catch(err => res.status(404).send(err));
}

module.exports.editImage = async(req, res) => {
  const path = Object.values(req.files)[0].path;
  const username = req.user.username;
  console.log(path, username)
  cloudinary.v2.uploader.upload(path, { public_id: `exceed/exceed${username}` })
  .then(result => {
    Users.updateOne({username}, {'image' : result.url})
    .catch(err => console.log(err))
  })
  .then(() => res.sendStatus(200))
  .catch(err => res.status(404).send(err))
  .catch(err => res.status(404).send(err));
}

module.exports.tornamentAssign = async(req, res) => {
  const userId = req.user._id;
  const tournament = await Tournaments.findOne({publicID: req.query.publicID});
  let index = tournament.users.findIndex(e => e.userId == userId);
  console.log(index)
  if (index === -1) {
    tournament.users.push({users: {userId}})
    
    Tournaments.updateOne({publicID: req.query.publicID}, {'$push': {users: {userId}}})
    .then((result) => res.sendStatus(200)).catch(err => res.send(401));


    Users.updateOne({_id: userId}, {$push: {tournaments: {publicID: req.query.publicID}}})
    .catch((err) => console.log(err));
  } else {
    res.send('user alredy exist').status(500);
  } 
}