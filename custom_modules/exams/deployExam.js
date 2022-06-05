const client = require("../../db/server").client;

function deployExam(req, res) {
  const examCollection = client.db(process.env.DATABASE).collection("Exams");
  examCollection.updateOne(
    { identifier: req.body.identifier, deployed: false },
    { $set: { deployed: true, writable: true } },
    { upsert: false },
    (err, result) => {
      if (err) throw err;
      if (result != null) {
        res.send(result)
      }
    }
  );
}

module.exports = deployExam;
