const jwt = require("jsonwebtoken");
const decryptId = require("../crypto/decryptId");

function verifyAdminToken(req, res, next) /* middleware */ {
  req.body.id = decryptId(req.body.id)
  const authHeader = req.headers['authorization'];
  const admintoken = authHeader.split(" ")[1];

  // to verify the token
  jwt.verify(admintoken, process.env.ADMIN_TOKEN_SECRET, (err, user) => {
    if (err) res.send(err);

    if (user.role == "admin" && user.id == req.body.id) {
      next();
    } else {
      res.status(401).send({message: "You are not an admin"});
    }
  });
}

module.exports = verifyAdminToken;