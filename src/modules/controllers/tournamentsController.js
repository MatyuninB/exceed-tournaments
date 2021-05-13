const Tournaments = require('../../db/tournaments');

module.exports.getAllTournaments = (req, res) => {
  Tournaments
  .find()
  .then(result => res.send(result))
  .catch(err => {
    res.send('database not avalible ' + err);
    console.log(err);
  })
}

module.exports.newTournament = (req, res) => {
  const tournament = {title, date, users, place, status} = req.body;

  const newTournament = new Tournaments(tournament);
  newTournament
  .save()
  .then(() => res.send(`${title} created!`))
  .catch(err => {
    res.send(err);
    console.log(err);
  });
}