const client = require("../../db/server").client;

function getDevelopmentExam(req, res) {
  let identifier = req.params.exam;
  const examCollection = client.db(process.env.DATABASE).collection("Exams");
  examCollection.findOne(
    { deployed: false, identifier },
    { projection: { _id: 0 } },
    (err, result) => {
      if (err) throw err;
      if (result != null) {
        res.send(result);
      }
    }
  );
}

module.exports = getDevelopmentExam;
