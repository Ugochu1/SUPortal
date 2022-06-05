const decryptId = require("../crypto/decryptId");

const client = require("../db/server").client;

function getNotifications(req, res) {
  let id = req.body.id;

  const notifications = client
    .db(process.env.DATABASE)
    .collection("Notifications");

  notifications
    .find({ receiver: id })
    .sort({ date: -1 })
    .limit(20)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
  notifications.updateMany(
    { receiver: id, read: false },
    { $set: { read: true } },
    { upsert: false }, (err) => {
      if(err) throw err;
    }
  );
}

module.exports = getNotifications;
