const client = require("../../db/server").client;

function getLiveExamWithAnswers(req, res) {
  let identifier = req.params.exam;
  const examCollection = client.db(process.env.DATABASE).collection("Exams");
  examCollection.findOne(
    { deployed: true, identifier },
    (err, result) => {
      if (err) throw err;
      if (result != null) {
        res.send(result);
      }
    }
  );
}

module.exports = getLiveExamWithAnswers;
