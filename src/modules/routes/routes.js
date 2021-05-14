const express = require('express');
const router = express.Router();

const {
  getAllTournaments,
  newTournament,
  getOneTournament,
} = require('../controllers/tournamentsController');

const {
  newUser,
  userLogin
} = require('../controllers/usersController');

const isAuth = require('../auth/isAuth');

router.get('/tournaments', getAllTournaments);
router.get('/tornament', getOneTournament)
router.post('/newTournament', newTournament);

router.post('/create_user', newUser);
router.post('/userLogin', userLogin);
router.post('/isAuth', isAuth, (req, res) => res.send(req.user))

module.exports = router;