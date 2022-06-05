const jwt = require("jsonwebtoken");

 function decryptId(encryptedId) {
  return jwt.verify(encryptedId, process.env.ID_SECRET, (err, user) => {
    if(err) console.log(err);
    return user
  });

}

module.exports = decryptId;