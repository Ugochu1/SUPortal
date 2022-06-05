const client = require("../db/server").client;

function getConversation(req, res) {
  const messageCollection = client
    .db(process.env.DATABASE)
    .collection("Messages");
  messageCollection
    .find({ receiver: req.params.identifier })
    .sort({ date: 1 })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
}

module.exports = getConversation;
