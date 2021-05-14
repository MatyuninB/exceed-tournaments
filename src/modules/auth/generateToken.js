const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const signature = process.env.TOKEN_SIGN;
  const expiresIn = '6h';
  const data = {
    _id: user._id,
    username: user.username,
  }

  return jwt.sign({data}, signature, {expiresIn});
}

module.exports = generateToken;