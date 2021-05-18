const express = require('express');
const tournaments = require('../../db/tournaments');
const router = express.Router();
const isAuth = require('../auth/isAuth');
const {
  getAllTournaments,
  newTournament,
  getOneTournament,
  tornamentUserControl,
  tornamentAddScore,
  changeJobStatus,
  changeScore
} = require('../controllers/tournamentsController');

const {
  newUser,
  userLogin,
  userUpdate,
  userInfo,
  imageHandler,
  tornamentAssign,
  editImage
} = require('../controllers/usersController');


router.get('/tournaments', getAllTournaments);
router.get('/tornament', getOneTournament)
router.post('/newTournament', newTournament);
router.post('/tornamentUserContol', tornamentUserControl);
router.post('/tornamentAddScore', isAuth, tornamentAddScore);
router.post('/changeJobStatus', isAuth, changeJobStatus);
router.post('/changeScore', isAuth, changeScore);

router.post('/create_user', newUser);
router.post('/userLogin', userLogin);
router.post('/userUpdate', isAuth, userUpdate);
router.get('/tockenCheck', isAuth, (req, res) => res.send({ 
  _id: req.user._id,
  admin: req.user.admin,
  fullname: req.user.fullname,
  username: req.user.username, 
  image: req.user.image, 
  role: req.user.role, 
  office: req.user.office,
  tournaments: req.user.tournaments
}));
router.get('/userInfo', isAuth, userInfo);
router.post('/userPicture', imageHandler);
router.post('/editImage', isAuth, editImage);
router.get('/tournamentAssign', isAuth, tornamentAssign);

module.exports = router;