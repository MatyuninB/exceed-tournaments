const jwt = require('jsonwebtoken');
const Users = require('../../db/users');

const isAuth = (req, res, next) => {
  const token = req.headers.auth;
  
  jwt.verify(token, process.env.TOKEN_SIGN, (err, decoded) => {
    if (decoded) {
      Users.findOne({_id: decoded.data._id})
      .then(result => {
        req.user = result;
        next();
      })
      .catch(err => res.status(404).send('Token doest exist'));
    } else {
      res.status(401).send(err.message)
    }
  });
}

module.exports = isAuth;