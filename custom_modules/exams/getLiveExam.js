const client = require("../../db/server").client;

function getLiveExam(req, res) {
  let identifier = req.params.exam;
  const examCollection = client.db(process.env.DATABASE).collection("Exams");
  examCollection.findOne(
    { deployed: true, identifier },
    { projection: { _id: 0, "sections.questions.answer": 0 } },
    (err, result) => {
      if (err) throw err;
      if (result != null) {
        res.send(result);
      }
    }
  );
}

module.exports = getLiveExam;
