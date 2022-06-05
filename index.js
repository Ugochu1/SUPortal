const express = require("express"); // import the express package
require("dotenv").config(); // give you access to the .env file
const app = express(); // fire up the express application
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const mongodb = require("./db/server").main;
mongodb().then(/* */).catch(console.error);

const client = require("./db/server").client;
// ...

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on("getunreadmessages", (data) => {
    let decryptedId = decryptId(data);
    const notifications = client
      .db(process.env.DATABASE)
      .collection("Notifications");
    notifications
      .find({ receiver: decryptedId, read: false })
      .toArray((err, result) => {
        if (err) throw err;
        socket.emit("unreadmessages", result);
      });
  });
  // console.log(`Client with ID of ${socket.id}!`);
  socket.on("send_notification", (data) => {
    const notifications = client
      .db(process.env.DATABASE)
      .collection("Notifications");
    data.receiver.forEach((receiver) => {
      notifications.insertOne(
        {
          message: data.message,
          receiver: receiver,
          date: data.date,
          read: data.read,
        },
        (err) => {
          if (err) throw err;
          notifications
            .find({ receiver: receiver })
            .limit(1)
            .sort({ date: -1 })
            .toArray((err, result) => {
              if (err) throw err;
              result.forEach((message) => {
                socket
                  .to(message.receiver)
                  .emit("receive_notification", message);
              });
            });
        }
      );
    });
  });

  socket.on("send_initialization_message", (data) => {
    const messageCollection = client
      .db(process.env.DATABASE)
      .collection("Messages");
    messageCollection.insertOne(
      {
        message: data.message,
        sender: data.sender,
        receiver: data.receiver,
        date: data.date,
        readBy: data.readBy,
      },
      (err) => {
        if (err) throw err;
      }
    );
  });

  socket.on("read_all", (data) => {
    const decryptedId = decryptId(data.encryptedId);
    const messageCollection = client
      .db(process.env.DATABASE)
      .collection("Messages");
    messageCollection.updateMany(
      {
        receiver: data.receiver,
        readBy: { $ne: decryptedId },
      },
      { $push: { readBy: decryptedId } },
      (err) => {
        if (err) throw err;
      }
    );
  });

  socket.on("send_message", (data) => {
    let decryptedId = decryptId(data.id);
    socket.to(data.receiver).emit("receive_live_message", {
      message: data.message,
      sender: data.sender,
      receiver: data.receiver,
      date: data.date,
      readBy: [decryptedId],
    });
    const messageCollection = client
      .db(process.env.DATABASE)
      .collection("Messages");
    messageCollection.insertOne(
      {
        message: data.message,
        sender: data.sender,
        receiver: data.receiver,
        date: data.date,
        readBy: [decryptedId],
      },
      (err) => {
        if (err) throw err;
        let firstname = data.sender.split(" ")[0];
        let lastname = data.sender.split(" ")[1];
        const usersCollection = client
          .db(process.env.DATABASE)
          .collection("Users");
        usersCollection.findOne({ firstname, lastname }, (err, result) => {
          if (err) throw err;
          let courses = [];
          for (let i = 0; i < result.courses.length; i++) {
            courses.push(result.courses[i].identifier);
          }

          (async function getLastMessages() {
            const messageCollection = client
              .db(process.env.DATABASE)
              .collection("Messages");
            const aggregatedMessage = messageCollection.aggregate([
              { $match: { receiver: { $in: courses } } },
              { $sort: { date: 1 } },
              {
                $group: {
                  _id: "$receiver",
                  lastMessage: { $last: "$message" },
                },
              },
            ]);
            const responseArray = [];
            for await (const doc of aggregatedMessage) {
              responseArray.push(doc);
            }
            socket.to(data.receiver).emit("receive_not_live_message", {
              data: responseArray,
              updated: data.receiver,
            });
          })();
        });
      }
    );
  });
});

// db

app.use(cors());

const match = require("./db/checkuser");
const validate = require("./db/validateuser");
const courseNotFound = require("./db/checkcourseidentifier").courseNotFound;
const courseFound = require("./db/checkcourseidentifier").courseFound;
const courseNotDeployed =
  require("./db/checkcourseidentifier").courseNotDeployed;
const courseDeployed = require("./db/checkcourseidentifier").courseDeployed;

// db ends here

//authentication starts here

const verifyUserToken = require("./authentication/verifyUserToken");
const verifyAdminToken = require("./authentication/verifyAdminToken");

//authentication ends here

// custom_modules starts here

const signup = require("./custom_modules/signup");
const login = require("./custom_modules/login");
const initializeCourse = require("./custom_modules/initializeCourse");
const deleteCourse = require("./custom_modules/deleteCourse");
const retrieveCourse = require("./custom_modules/retrieveCourse");
const updateCourse = require("./custom_modules/updateCourse");
const courseEnroll = require("./custom_modules/courseEnroll");
const courseDelist = require("./custom_modules/courseDelist");
const deployCourse = require("./custom_modules/deployCourse");
const getUndeployedCourses = require("./custom_modules/getUndeployedCourses");
const getDeployedCourses = require("./custom_modules/getDeployedCourses");
const getUser = require("./db/getUser");
const encryptId = require("./crypto/encryptId");
const decryptId = require("./crypto/decryptId");
const getAdmins = require("./custom_modules/getAdmins");
const addAdministrators = require("./custom_modules/addAdministrators");
const getNotifications = require("./custom_modules/getNotifications");
const getUnreadNotifications = require("./custom_modules/getUnreadNotifications");
const getCourse = require("./custom_modules/getCourse");
const getAllCourses = require("./custom_modules/getAllCourses");
const getUnreadMessages = require("./custom_modules/getUnreadMessages");
const getLastMessages = require("./custom_modules/getLastMessages");
const getConversation = require("./custom_modules/getConversation");
const initializeExam = require("./custom_modules/exams/initializeExam");
const getDevelopmentExams = require("./custom_modules/exams/getDevelopmentExams");
const getDevelopmentExam = require("./custom_modules/exams/getDevelopmentExam");
const updateExamSection = require("./custom_modules/exams/updateExamSection");
const deployExam = require("./custom_modules/exams/deployExam");
const getLiveExams = require("./custom_modules/exams/getLiveExams");
const verifyExamAccessKey = require("./custom_modules/exams/verifyExamAccessKey");
const getLiveExam = require("./custom_modules/exams/getLiveExam");
const getLiveExamWithAnswers = require("./custom_modules/exams/getLiveExamWithAnswers");
const submitExam = require("./custom_modules/exams/submitExam");
const getExamStatistics = require("./custom_modules/exams/getExamStatistics");
const removeExam = require("./custom_modules/exams/removeExam");
const getAccount = require("./custom_modules/getAccount");
const changePassword = require("./custom_modules/changePassword");

// custom_modules ends here

app.use(express.json()); // middleware to allow communication using json

/* My application starts here */

app.post("/signup/:role", match, (req, res) => {
  signup(req, res); // handle the signup request
});

app.post("/login", validate, (req, res) => {
  login(req, res);
});

app.post("/dashboard", verifyUserToken, (req, res) => {
  getUser(req, res);
});

app.post("/create_course", verifyAdminToken, courseNotFound, (req, res) => {
  initializeCourse(req, res);
});

app.post("/delete_course", verifyAdminToken, courseFound, (req, res) => {
  deleteCourse(req, res);
});

app.post(
  "/course_enroll",
  verifyUserToken,
  courseFound,
  courseDeployed,
  (req, res) => {
    courseEnroll(req, res);
  }
);

app.post(
  "/course_delist",
  verifyUserToken,
  courseFound,
  courseDeployed,
  (req, res) => {
    courseDelist(req, res);
  }
);

app.post("/modify_course", verifyAdminToken, courseNotDeployed, (req, res) => {
  retrieveCourse(req, res);
});

app.post("/update_course", verifyAdminToken, courseNotDeployed, (req, res) => {
  updateCourse(req, res);
});

app.post(
  "/deploy_course",
  verifyAdminToken,
  courseFound,
  courseNotDeployed,
  (req, res) => {
    deployCourse(req, res);
  }
);

app.post("/development_courses", verifyAdminToken, (req, res) => {
  getUndeployedCourses(req, res);
});

app.post("/get_deployed_courses", verifyUserToken, (req, res) => {
  getDeployedCourses(req, res);
});

app.post(
  "/get_course",
  verifyUserToken,
  courseFound,
  courseDeployed,
  (req, res) => {
    getCourse(req, res);
  }
);

app.post("/encryptId", (req, res) => {
  const id = req.body.id;
  const encryptedId = encryptId(id);
  res.send({ encryptedId });
});

app.post("/decryptId", (req, res) => {
  const encryptedId = req.body.encryptedId;
  const decryptedId = decryptId(encryptedId);
  res.send({ decryptedId });
});

app.post("/admin_list", verifyAdminToken, (req, res) => {
  getAdmins(req, res);
});

app.post("/add_administrators", verifyAdminToken, (req, res) => {
  addAdministrators(req, res);
});

app.post("/get_notifications", verifyUserToken, (req, res) => {
  getNotifications(req, res);
});

app.post("/getunreadnotifications", verifyUserToken, (req, res) => {
  getUnreadNotifications(req, res);
});

app.post("/getunreadmessages", verifyUserToken, (req, res) => {
  getUnreadMessages(req, res);
});

app.post("/getlastmessages", verifyUserToken, (req, res) => {
  getLastMessages(req, res);
});

app.get("/all_courses", (req, res) => {
  getAllCourses(res);
});

app.get("/conversation/:identifier", (req, res) => {
  getConversation(req, res);
});

app.post("/read_all", verifyUserToken, (req, res) => {
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

app.post("/initialize_exam", verifyAdminToken, (req, res) => {
  initializeExam(req, res);
});

app.post("/get_development_exams", verifyAdminToken, (req, res) => {
  getDevelopmentExams(res);
});

app.post("/get_development_exam/:exam", verifyAdminToken, (req, res) => {
  getDevelopmentExam(req, res);
});

app.post(
  "/update_exam_section/:exam/:section",
  verifyAdminToken,
  (req, res) => {
    updateExamSection(req, res);
  }
);

app.post("/deploy_exam", verifyAdminToken, (req, res) => {
  deployExam(req, res);
});

app.post("/get_live_exams", verifyUserToken, (req, res) => {
  getLiveExams(res);
});

app.post("/verify_exam_access_key/:exam", verifyUserToken, (req, res) => {
  verifyExamAccessKey(req, res);
});

app.post("/get_live_exam/:exam", verifyUserToken, (req, res) => {
  getLiveExam(req, res);
});

app.post("/get_live_exam_withAnswers/:exam", verifyUserToken, (req, res) => {
  getLiveExamWithAnswers(req, res);
});

app.post("/submit_exam/:exam", verifyUserToken, (req, res) => {
  submitExam(req, res);
});

app.post("/remove_exam/:identifier", verifyUserToken, (req, res) => {
  removeExam(req, res);
});

app.post("/get_exam_statistics/:identifier", verifyUserToken, (req, res) => {
  getExamStatistics(req, res);
});

app.post("/get_account", (req, res) => {
  getAccount(req, res);
});

app.post("/change_password", (req, res) => {
  changePassword(req, res);
})

/* My application ends here */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend server is running on port " + PORT);
});

server.listen(3001, () => {
  console.log("Socket io server running");
});
