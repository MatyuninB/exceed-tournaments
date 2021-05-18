const { response } = require('express');
const Tournaments = require('../../db/tournaments');
const Users = require('../../db/users');

module.exports.getAllTournaments = (req, res) => {
  Tournaments
  .find()
  .then(result => res.send(result.map(e => {return {title: e.description.title, publicID : e.publicID, users: e.users}})))
  .catch(err => {
    res.send('database not avalible ' + err);
    console.log(err);
  })
}

module.exports.getOneTournament = async(req, res) => {
  const { publicID } = req.query;
  let tournament = {};
  let userInfo = [];

  await Tournaments.findOne({ publicID })
  .then(result => result? tournament = result : res.sendStatus(404))
  .catch(err => {
    console.log(err);
    res.sendStatus(404);
  });


  if (tournament.users) {
    for (let item of tournament.users) {
      let tmp = {};
      await Users.find({ _id: item.userId})
      .then(result => {
        const {username, image, fullname, office} = result[0];
        const {score, difficulty, jobStatus, gitURL, _id, marks, userId} = item;
        item = {username, fullname, image, office, score, difficulty, userId, jobStatus, gitURL, _id, marks};
        userInfo.push(item);
      })
      .catch(err => console.log(err));
    };
  }
  
  let copy = Object.assign({}, tournament._doc);
  copy.users = userInfo;
  res.send(copy);
}

module.exports.newTournament = (req, res) => {
  const tournament = req.body;

  const newTournament = new Tournaments(tournament);
  newTournament
  .save()
  .then(() => res.sendStatus(200).send(`${title} created!`))
  .catch(err => {
    res.sendStatus(400);
    console.log(err);
  });
}

module.exports.tornamentUserControl = async(req, res) => {
  const { publicID, _id } = req.body;
  let tmp = [];

  await Tournaments.findOne({publicID})
  .then((result) => {
    tmp = [...result.users];
  }).catch(err => res.status(401).send('no tournament'));

  _id.forEach((e, i) => { if(tmp.findIndex(elem => elem.userId === e) === -1) tmp.push({userId: e})});
  Tournaments.updateOne({publicID}, {users: tmp}).then(() => res.sendStatus(200)).catch(err => res.status(401).send(err));
}

module.exports.tornamentAddScore = async(req, res) => {
  const { id, publicID } = req.query;
  const { score, comment } = req.body;
  let users;
  if (req.user.role === 'Juri') {
    await Tournaments.find({ publicID })
    .then(responce => {
      let tmp = Object.assign({}, responce)['0'];
      users = tmp.users;
    });
  } else {
    res.sendStatus(403);
  }

  let index = users.findIndex(e => e.userId == id);
  if (index > -1) {
    let {username, image} = req.user;
    user = Object.assign({},users[index]._doc);
    user.marks.push({name: username, image, score, comment});
    delete user._id;

    await Tournaments.updateOne({publicID ,'users.userId': id}, {$set: {'users.$': user}})
    .then(() => res.sendStatus(200))
    .catch(err => res.send('v jopy'));
  } else {
    res.sendStatus(404);
  }
 

  await Tournaments.findOne({publicID})
  .then(result => {
    let index = users.findIndex(e => e.userId == id);
    if (index > -1) {
      let marks = result.users[index].marks;
      let total = 0;
      marks.forEach((e) => total += parseInt(e.score));
      console.log(total);
      let score = (total/marks.length).toFixed(2);

      Tournaments.updateOne({publicID, 'users.userId': id}, {$set: {'users.$.score': score.toString()}})
      .then(result => sendStatus(200))
      .catch(err => res.send('v jopy'));
    }
  });
}

module.exports.changeScore = async(req, res) => {
  const {id, publicID} = req.query;
  console.log()
  const tournament = await Tournaments.findOne({publicID});
  console.log(tournament)
  const index = tournament.users.findIndex(e => e.userId === id);

  if (index === -1) {
    res.sendStatus(404);
  } else {
    let indx = tournament.users[index].marks.findIndex(e => e.name === req.user.username);
    if (indx !== -1) {
      tournament.users[index].marks[indx] = Object.assign({name: req.user.username, image:req.user.image} ,req.body);
      await Tournaments.updateOne({publicID}, {users: tournament.users})
      .then(() => res.send(200))
      .catch(err => res.sendStatus(500));
    } else {
      res.sendStatus(404);
    }
  }

  await Tournaments.findOne({publicID})
  .then(result => {
    if (index > -1) {
      let marks = result.users[index].marks;
      let total = 0;
      marks.forEach((e) => total += parseInt(e.score));
      console.log(total);
      let score = (total/marks.length).toFixed(2);

      Tournaments.updateOne({publicID, 'users.userId': id}, {$set: {'users.$.score': score.toString()}})
      .catch(err => res.send('v jopy'));
    }
  });
}


module.exports.changeJobStatus = async(req, res) => {
  const {publicID} = req.body;
  const {gitURL, status} = req.body;
  const id = req.user._id.toString();

  Tournaments.updateOne({publicID, 'users.userId': id}, {$set: {'users.$.jobStatus': status, 'users.$.gitURL': gitURL}})
  .then(responce => res.send(responce))
  .catch(err => console.log(err));
}