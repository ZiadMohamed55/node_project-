const appError = require("../utils/appError");

module.exports = (...roles) => {
  console.log("role", roles);
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(appError.create("this role unauthorized", 404));
    }
  };
};
