const express = require('express');
const router = express.Router();
const isAuth = require('../auth/isAuth');
const {
  getAllTournaments,
  newTournament,
  getOneTournament,
  tornamentUserControl,
  tornamentAddScore
} = require('../controllers/tournamentsController');

const {
  newUser,
  userLogin,
  userUpdate,
  userInfo
} = require('../controllers/usersController');


router.get('/tournaments', getAllTournaments);
router.get('/tornament', getOneTournament)
router.post('/newTournament', newTournament);
router.post('/tornamentUserContol', tornamentUserControl);
router.post('/tornamentAddScore', isAuth, tornamentAddScore);

router.post('/create_user', newUser);
router.post('/userLogin', userLogin);
router.post('/userUpdate', isAuth, userUpdate);
router.get('/tockenCheck', isAuth, (req, res) => res.send({ _id: req.user._id, username: req.user.username, image: req.user.image }));
router.get('/userInfo', isAuth, userInfo);

module.exports = router;