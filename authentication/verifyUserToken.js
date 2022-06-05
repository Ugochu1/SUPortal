const jwt = require("jsonwebtoken");
const decryptId = require("../crypto/decryptId");

function verifyUserToken(req, res, next) /* middleware */ {
  let id = req.body.id;
  req.body.id = decryptId(id);
  const authHeader = req.headers["authorization"];
  const accesstoken = authHeader.split(" ")[1];

  // to verify the token
  jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.send(err);
    } else if (user == null) {
    } else {

      if (user.id == req.body.id) {
        next();
      } else {
        res.sendStatus(401);
      }
    }
  });
}

module.exports = verifyUserToken;
