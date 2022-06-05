const generateUserToken = require("../authentication/generateUserToken");
const generateAdminToken = require("../authentication/generateAdminToken");
const encryptId = require("../crypto/encryptId");

function login(req, res) {
  let { id, role } = req.body;
  let req_body = { id, role };
  const encryptedId = encryptId(id);
  let accessToken = generateUserToken(req_body);
  let adminToken = generateAdminToken(req_body);

  res.send({ accessToken, adminToken, encryptedId });
}

module.exports = login;
