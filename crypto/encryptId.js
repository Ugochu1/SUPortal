const jwt = require("jsonwebtoken");

function encryptId(id) {  
  const encryptedId = jwt.sign(id, process.env.ID_SECRET);
  return encryptedId;
}

module.exports = encryptId;