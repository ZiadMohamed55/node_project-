const express = require("express");
const morgan = require("morgan");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const courseRouter = require("./Routs/courseRoute");
const usersRouter = require("./Routs/userRoute");
const cors = require("cors");
const app = express();
const httpStatusText = require("./utils/httpStatusText");
//install dotenv
require("dotenv").config();

exports.app = app;
app.use(cors());
app.use(express.json());
//                            to show photos
const path = require("path")
app.use('/uploads',express.static(path.join(__dirname,"uploads")));

app.use(morgan("dev"));
const url = process.env.MONGO_URL;
// "mongodb+srv://ziadmohamedmm389:ziadmohamed123@learnnode.2iqciss.mongodb.net/codezone?retryWrites=true&w=majority";

mongoose.connect(url).then(() => {
  console.log("mongoDb server started");
});

app.use("/api/cources", courseRouter);
app.use("/api/users",usersRouter);
// glopal midellware for error in route
app.all("*", (req, res, next) => {
  return res.status("404").json({
    status: httpStatusText.ERROR,
    message: "this course not available",
  });
});
// glopal rout handler.
app.use((error, req, res, next) => {
  res
    .status("500")
    .json({ status: httpStatusText.ERROR, message: error.message });
});

app.listen(process.env.PORT || 1000, () => {
  console.log("Example of lestening at port", 1000);
});
