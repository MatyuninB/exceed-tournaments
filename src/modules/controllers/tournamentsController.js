const Tournaments = require('../../db/tournaments');
const Users = require('../../db/users');

module.exports.getAllTournaments = (req, res) => {
  Tournaments
  .find()
  .then(result => res.send(result))
  .catch(err => {
    res.send('database not avalible ' + err);
    console.log(err);
  })
}

module.exports.getOneTournament = async(req, res) => {
  const {_id} = req.query;
  let tournament = {};
  let userInfo = [];

  await Tournaments.findOne({ _id })
  .then(result => tournament = result)
  .catch(err => {
    console.log(err);
    res.send(err);
  });


  for (let item of tournament.users) {
    let tmp = {};
    await Users.find({ _id: item.userId})
    .then(result => {
      const {username, image, office} = result[0];
      const {score, difficulty, jobStatus, gitURL, _id} = item;
      item = {username, image, office, score, difficulty, jobStatus, gitURL, _id};
      userInfo.push(item);
    })
    .catch(err => console.log(err));
  };
  
  let copy = Object.assign({}, tournament._doc);
  copy.users = userInfo;
  res.send(copy);
}

module.exports.newTournament = (req, res) => {
  const tournament = { title, description, date, users, place, status } = req.body;

  const newTournament = new Tournaments(tournament);
  newTournament
  .save()
  .then(() => res.send(`${title} created!`))
  .catch(err => {
    res.send(err);
    console.log(err);
  });
}