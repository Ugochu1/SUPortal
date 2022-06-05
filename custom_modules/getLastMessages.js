const client = require("../db/server").client;

async function getLastMessages(req, res) {
  const messageCollection = client
    .db(process.env.DATABASE)
    .collection("Messages");
  const aggregatedMessage = messageCollection.aggregate([
    { $match: { receiver: { $in: req.body.courses } } },
    { $sort: { date: 1 } },
    { $group: { _id: "$receiver", lastMessage: { $last: "$message" } } },
  ]);
  const responseArray = []
  for await (const doc of aggregatedMessage) {
    responseArray.push(doc)
  }
  res.send(responseArray);
}

module.exports = getLastMessages;
