const jwt = require("jsonwebtoken");

function generateAdminToken(user_details) {
  return jwt.sign(user_details, process.env.ADMIN_TOKEN_SECRET, {expiresIn: "1d"});
}

module.exports = generateAdminToken;