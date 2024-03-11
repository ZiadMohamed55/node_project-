const express = require("express");
const courceController = require("../CONTROLERS/courceControler");
const verifyToken = require("../medelware/verifyToken");
const userRoles = require("../utils/userRoles");
const router = express.Router();
const allowedTo = require("../medelware/allowedTo");
router
  .route("/")
        .get(courceController.getAllCorces)
        .post(courceController.addCource);
router
  .route("/:courseId")
        .get(courceController.getCource)
        .patch(courceController.updateCourse)
        .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),courceController.deleteCourse);

module.exports = router;
