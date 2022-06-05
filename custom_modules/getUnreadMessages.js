const client = require("../db/server").client;

function getUnreadMessages(req, res) {
  const messageCollection = client
    .db(process.env.DATABASE)
    .collection("Messages");
  let courses = req.body.courses;
  messageCollection
    .find({
      receiver: { $in: courses },
      readBy: { $ne: req.body.id },
    })
    .sort({ date: 1 })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
}

module.exports = getUnreadMessages;
