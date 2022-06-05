const client = require("../../db/server").client;

function removeExam(req, res) {
  const identifier = req.params.identifier;
  const examCollection = client.db(process.env.DATABASE).collection("Exams");
  examCollection.updateOne(
    { identifier },
    { $set: { writable: false } },
    { upsert: false },
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
}

module.exports = removeExam;
