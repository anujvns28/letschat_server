const express = require('express');
const app = express();
const cors = require("cors");
const fileUpload = require('express-fileupload');
const { dbConnection } = require('./config/dbconnect');
const { cloudinaryConnect } = require('./config/cloudinary');
require("dotenv").config()


const port = process.env.PORT || 4000;

//dbconnection
dbConnection();

//cloudnary connect
cloudinaryConnect();

//middleware
app.use(express.json());

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


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

