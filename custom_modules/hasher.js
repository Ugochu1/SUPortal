const crypto = require("crypto");

function hasher(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

module.exports = hasher;