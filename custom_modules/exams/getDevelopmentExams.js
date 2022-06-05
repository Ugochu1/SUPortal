const client = require("../../db/server").client;

function getDevelopmentExams(res) {
  const examCollection = client.db(process.env.DATABASE).collection("Exams");
  examCollection.find({ deployed: false }).toArray((err, result) => {
    if (err) throw err;
    res.send(result);
  });
}

module.exports = getDevelopmentExams;
