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

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 4000;

//dbconnection
dbConnection();

//cloudnary connect
cloudinaryConnect();

//middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
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
  console.log("a user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
