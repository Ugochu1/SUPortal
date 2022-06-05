const client = require("../../db/server").client;

function submitExam(req, res) {
  let identifier = req.params.exam
  let details = req.body.details;
  const examCollection = client.db(process.env.DATABASE).collection("Exams");
  examCollection.updateOne(
    { identifier },
    { $push: { participants : details } },
    {upsert: false},
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
}

module.exports = submitExam;
