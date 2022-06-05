const decryptId = require("../crypto/decryptId");

const client = require("../db/server").client;

function getUnreadNotifications(req, res) {
  let id = req.body.id;

  const notifications = client
    .db(process.env.DATABASE)
    .collection("Notifications");

  notifications
    .find({ receiver: id, read: false })
    .sort({ date: -1 })
    .limit(20)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
}

module.exports = getUnreadNotifications;
