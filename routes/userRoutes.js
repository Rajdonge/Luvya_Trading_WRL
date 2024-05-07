const express = require("express");
const userRoutes = express.Router();

const {
  registerUser,
  verifyMail,
  loginUser,
  forget_password,
  reset_password,
  getUsers,
  userProfile,
  changePassword,
  updateUserData,
} = require("../controllers/userController");

const {
  userRegisterValidate,
  userLoginValidate,
  changePasswordValidate,
} = require("../middleware/userValidation");

const { ensureAuthenticated } = require("../middleware/auth");

userRoutes.post("/register", userRegisterValidate, registerUser);
userRoutes.get("/verify", verifyMail);
userRoutes.post("/login", userLoginValidate, loginUser);
userRoutes.post("/forget-password", forget_password);
userRoutes.get("/reset-password", reset_password);
userRoutes.get("/users", ensureAuthenticated, getUsers);
userRoutes.get("/userProfile", ensureAuthenticated, userProfile);
userRoutes.patch('/updateUserData', ensureAuthenticated, updateUserData);
userRoutes.post(
  "/changePassword",
  ensureAuthenticated,
  changePasswordValidate,
  changePassword
);

module.exports = userRoutes;
