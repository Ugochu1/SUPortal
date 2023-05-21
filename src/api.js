const express = require("express"); // import the express package
require("dotenv").config(); // give you access to the .env file
const app = express(); // fire up the express application
const router = express.Router();
const serverless = require("serverless-http");
const cors = require("cors");
const mongodb = require("../db/server").main;
mongodb().then(/* */).catch(console.error);

const client = require("../db/server").client;

// db

app.use("/.netlify/functions/api", router);
app.use(cors());

const match = require("../db/checkuser");
const validate = require("../db/validateuser");
const courseNotFound = require("../db/checkcourseidentifier").courseNotFound;
const courseFound = require("../db/checkcourseidentifier").courseFound;
const courseNotDeployed =
  require("../db/checkcourseidentifier").courseNotDeployed;
const courseDeployed = require("../db/checkcourseidentifier").courseDeployed;

// db ends here

//authentication starts here

const verifyUserToken = require("../authentication/verifyUserToken");
const verifyAdminToken = require("../authentication/verifyAdminToken");

//authentication ends here

// custom_modules starts here

const signup = require("../custom_modules/signup");
const login = require("../custom_modules/login");
const initializeCourse = require("../custom_modules/initializeCourse");
const deleteCourse = require("../custom_modules/deleteCourse");
const retrieveCourse = require("../custom_modules/retrieveCourse");
const updateCourse = require("../custom_modules/updateCourse");
const courseEnroll = require("../custom_modules/courseEnroll");
const courseDelist = require("../custom_modules/courseDelist");
const deployCourse = require("../custom_modules/deployCourse");
const getUndeployedCourses = require("../custom_modules/getUndeployedCourses");
const getDeployedCourses = require("../custom_modules/getDeployedCourses");
const getUser = require("../db/getUser");
const encryptId = require("../crypto/encryptId");
const decryptId = require("../crypto/decryptId");
const getAdmins = require("../custom_modules/getAdmins");
const addAdministrators = require("../custom_modules/addAdministrators");
const getNotifications = require("../custom_modules/getNotifications");
const getUnreadNotifications = require("../custom_modules/getUnreadNotifications");
const getCourse = require("../custom_modules/getCourse");
const getAllCourses = require("../custom_modules/getAllCourses");
const getUnreadMessages = require("../custom_modules/getUnreadMessages");
const getLastMessages = require("../custom_modules/getLastMessages");
const getConversation = require("../custom_modules/getConversation");
const initializeExam = require("../custom_modules/exams/initializeExam");
const getDevelopmentExams = require("../custom_modules/exams/getDevelopmentExams");
const getDevelopmentExam = require("../custom_modules/exams/getDevelopmentExam");
const updateExamSection = require("../custom_modules/exams/updateExamSection");
const deployExam = require("../custom_modules/exams/deployExam");
const getLiveExams = require("../custom_modules/exams/getLiveExams");
const verifyExamAccessKey = require("../custom_modules/exams/verifyExamAccessKey");
const getLiveExam = require("../custom_modules/exams/getLiveExam");
const getLiveExamWithAnswers = require("../custom_modules/exams/getLiveExamWithAnswers");
const submitExam = require("../custom_modules/exams/submitExam");
const getExamStatistics = require("../custom_modules/exams/getExamStatistics");
const removeExam = require("../custom_modules/exams/removeExam");
const getAccount = require("../custom_modules/getAccount");
const changePassword = require("../custom_modules/changePassword");

// custom_modules ends here

app.use(express.json()); // middleware to allow communication using json

/* My application starts here */

router.post("/signup/:role", match, (req, res) => {
  signup(req, res); // handle the signup request
});

router.post("/login", validate, (req, res) => {
  login(req, res);
});

router.post("/dashboard", verifyUserToken, (req, res) => {
  getUser(req, res);
});

router.post("/create_course", verifyAdminToken, courseNotFound, (req, res) => {
  initializeCourse(req, res);
});

router.post("/delete_course", verifyAdminToken, courseFound, (req, res) => {
  deleteCourse(req, res);
});

router.post(
  "/course_enroll",
  verifyUserToken,
  courseFound,
  courseDeployed,
  (req, res) => {
    courseEnroll(req, res);
  }
);

router.post(
  "/course_delist",
  verifyUserToken,
  courseFound,
  courseDeployed,
  (req, res) => {
    courseDelist(req, res);
  }
);

router.post(
  "/modify_course",
  verifyAdminToken,
  courseNotDeployed,
  (req, res) => {
    retrieveCourse(req, res);
  }
);

router.post(
  "/update_course",
  verifyAdminToken,
  courseNotDeployed,
  (req, res) => {
    updateCourse(req, res);
  }
);

router.post(
  "/deploy_course",
  verifyAdminToken,
  courseFound,
  courseNotDeployed,
  (req, res) => {
    deployCourse(req, res);
  }
);

router.post("/development_courses", verifyAdminToken, (req, res) => {
  getUndeployedCourses(req, res);
});

router.post("/get_deployed_courses", verifyUserToken, (req, res) => {
  getDeployedCourses(req, res);
});

router.post(
  "/get_course",
  verifyUserToken,
  courseFound,
  courseDeployed,
  (req, res) => {
    getCourse(req, res);
  }
);

router.post("/encryptId", (req, res) => {
  const id = req.body.id;
  const encryptedId = encryptId(id);
  res.send({ encryptedId });
});

router.post("/decryptId", (req, res) => {
  const encryptedId = req.body.encryptedId;
  const decryptedId = decryptId(encryptedId);
  res.send({ decryptedId });
});

router.post("/admin_list", verifyAdminToken, (req, res) => {
  getAdmins(req, res);
});

router.post("/add_administrators", verifyAdminToken, (req, res) => {
  addAdministrators(req, res);
});

router.post("/get_notifications", verifyUserToken, (req, res) => {
  getNotifications(req, res);
});

router.post("/getunreadnotifications", verifyUserToken, (req, res) => {
  getUnreadNotifications(req, res);
});

router.post("/getunreadmessages", verifyUserToken, (req, res) => {
  getUnreadMessages(req, res);
});

router.post("/getlastmessages", verifyUserToken, (req, res) => {
  getLastMessages(req, res);
});

router.get("/all_courses", (req, res) => {
  getAllCourses(res);
});

router.get("/conversation/:identifier", (req, res) => {
  getConversation(req, res);
});

router.post("/read_all", verifyUserToken, (req, res) => {
  const decryptedId = req.body.id;
  const messageCollection = client
    .db(process.env.DATABASE)
    .collection("Messages");
  messageCollection.updateMany(
    {
      receiver: req.body.receiver,
      readBy: { $ne: decryptedId },
    },
    { $push: { readBy: decryptedId } },
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

router.post("/initialize_exam", verifyAdminToken, (req, res) => {
  initializeExam(req, res);
});

router.post("/get_development_exams", verifyAdminToken, (req, res) => {
  getDevelopmentExams(res);
});

router.post("/get_development_exam/:exam", verifyAdminToken, (req, res) => {
  getDevelopmentExam(req, res);
});

router.post(
  "/update_exam_section/:exam/:section",
  verifyAdminToken,
  (req, res) => {
    updateExamSection(req, res);
  }
);

router.post("/deploy_exam", verifyAdminToken, (req, res) => {
  deployExam(req, res);
});

router.post("/get_live_exams", verifyUserToken, (req, res) => {
  getLiveExams(res);
});

router.post("/verify_exam_access_key/:exam", verifyUserToken, (req, res) => {
  verifyExamAccessKey(req, res);
});

router.post("/get_live_exam/:exam", verifyUserToken, (req, res) => {
  getLiveExam(req, res);
});

router.post("/get_live_exam_withAnswers/:exam", verifyUserToken, (req, res) => {
  getLiveExamWithAnswers(req, res);
});

router.post("/submit_exam/:exam", verifyUserToken, (req, res) => {
  submitExam(req, res);
});

router.post("/remove_exam/:identifier", verifyUserToken, (req, res) => {
  removeExam(req, res);
});

router.post("/get_exam_statistics/:identifier", verifyUserToken, (req, res) => {
  getExamStatistics(req, res);
});

router.post("/get_account", (req, res) => {
  getAccount(req, res);
});

router.post("/change_password", (req, res) => {
  changePassword(req, res);
});

router.post("/send_notification", (req, res) => {
  const notifications = client
    .db(process.env.DATABASE)
    .collection("Notifications");
  req.body.receiver.forEach((receiver) => {
    notifications.insertOne(
      {
        message: req.body.message,
        receiver: receiver,
        date: req.body.date,
        read: req.body.read,
      },
      (err) => {
        if (err) throw err;
      }
    );
  });
  res.end();
});

/* My application ends here */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend server is running on port " + PORT);
});

// module.exports=app;
// module.exports.handler = serverless(app)
