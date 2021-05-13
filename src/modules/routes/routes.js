const express = require('express');
const router = express.Router();

const {
  getAllTournaments,
  newTournament,
} = require('../controllers/tournamentsController');

const {
  newUser,
} = require('../controllers/usersController');

router.get('/tournaments', getAllTournaments);
router.post('/newTournament', newTournament);

router.post('/create_user', newUser);

module.exports = router;