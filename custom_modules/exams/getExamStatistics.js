const client = require("../../db/server").client;

async function getExamStatistics(req, res) {
  const identifier = req.params.identifier;
  const examCollection = client.db(process.env.DATABASE).collection("Exams");
  const aggregatedScores = examCollection.aggregate([
    {
      $match: {
        identifier: identifier,
      },
    },

    // Expand the scores array into a stream of documents
    { $unwind: "$participants" },

    // Sort in descending order
    {
      $sort: {
        "participants.score": -1,
      },
    },
    { $project: { _id: 0, participants: 1 } },
    { $limit: 10 },
  ]);
  let responseArray = [];

  for await (const doc of aggregatedScores) {
    responseArray.push(doc);
  }
  res.send(responseArray);
}

module.exports = getExamStatistics;
