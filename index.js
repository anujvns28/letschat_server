const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { dbConnection } = require("./config/dbconnect");
const { cloudinaryConnect } = require("./config/cloudinary");
require("dotenv").config();
const authRoute = require("../server/routes/auth");
const userRoute = require("../server/routes/user");
const chatRoute = require("../server/routes/chat");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");
const { NEW_MESSAGE, NEW_MESSAGE_ALERT } = require("./constants/events");
const { v4 } = require("uuid");
const { getSockets } = require("./constants/helper");
const Message = require("./models/messeage");

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 4000;
exports.userSocketIDs = new Map();

//dbconnection
dbConnection();

//cloudnary connect
cloudinaryConnect();

//middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// mountinh
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);

io.on("connection", (socket) => {
  const user = {
    _id: "jdfskj",
    name: "anuj",
  };

  this.userSocketIDs(user._id.toString(), socket.id);

  const memberSockets = getSockets(members);
  io.to(memberSockets).emit(NEW_MESSAGE, {
    chatId,
    message: messageForRealTime,
  });
  io.to(memberSockets).emit(NEW_MESSAGE_ALERT, { chatId });
  console.log("a user connected", socket.id);

  socket.on(NEW_MESSAGE, async (data) => {
    const { chatId, members, message } = JSON.parse(data);
    const messageForRealTime = {
      content: message,
      _id: v4(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDb = {
      content: message,
      chat: chatId,
      sender: user._id,
    };

    try {
      await Message.create(messageForDb);
    } catch (err) {
      console.log("erro in creating message entery in db");
    }

    console.log("new message", messageForRealTime);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    this.userSocketIDs.delete(user._id.toString());
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
