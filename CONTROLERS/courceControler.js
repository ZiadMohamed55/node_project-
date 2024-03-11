const asyncWraper = require("../medelware/asyncWraper");
const courceModel = require("../models/cources.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");

const getAllCorces = asyncWraper (async(req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  //projection in find(projection )and do filter at elements
  const cources = await courceModel
    .find(/*{price :{$gt :35}}*/ { __v: false })
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { cources } });
});

const getCource = asyncWraper(async (req, res, next) => {
  const course = await courceModel.findById(req.params.courseId);

  if (!course) {
    res.status(404).json({ Msg: "course not found" });
    const error = appError.create("course not found ", 404, httpStatusText);
    return next(error);
  }
  res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const addCource = asyncWraper (async(req, res) => {
  const newCourse = new courceModel(req.body);
  await newCourse.save();
  res
    .status("201")
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWraper(async (req, res) => {
  const { courseId } = req.params.courseId;

  let updateCourse = await courceModel.findByIdAndUpdate(
    { _id: courseId },
    { $set: { ...req.body } }
  );
  if (!course) {
    return res.status(404).json({ msg: "course not found" });
  }
  res.status(200).json(updateCourse);
});
const deleteCourse = asyncWraper(async (req, res) => {
  const delet = await courceModel.deleteOne({ _id: req.params.courseId });

  res.status(200).json({ success: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllCorces,
  getCource,
  addCource,
  updateCourse,
  deleteCourse,
};
