const jwt = require("jsonwebtoken");

function generateUserToken(user_details) {
  return jwt.sign(user_details, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
}

module.exports = generateUserToken;