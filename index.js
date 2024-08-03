const express = require('express');
const app = express();
const cors = require("cors");
const fileUpload = require('express-fileupload');
const { dbConnection } = require('./config/dbconnect');
const { cloudinaryConnect } = require('./config/cloudinary');
require("dotenv").config()
const authRoute = require("../server/routes/auth");
const cookieParser = require('cookie-parser');


const port = process.env.PORT || 4000;

//dbconnection
dbConnection();

//cloudnary connect
cloudinaryConnect();

//middleware
app.use(express.json());
app.use(cookieParser())

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
app.use("/api/v1/auth",authRoute);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

