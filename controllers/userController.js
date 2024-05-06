const config = require("../config/config");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");

//hash password
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    throw new Error(error.message);
  }
};

//send mail to verify email
const sendVerifyMail = async (fullName, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "Email verification",
      html:
        "<p>Hi " +
        fullName +
        ' , please click here to <a href="http://localhost:8080/api/verify?id=' +
        user_id +
        '"> verify </a> your mail. </p>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

//verify mail
const verifyMail = async (req, res) => {
  try {
    const updateInfo = await UserModel.updateOne(
      { _id: req.query.id },
      { $set: { is_verified: true } }
    );
    console.log(updateInfo);
    res.render("email-verified");
  } catch (error) {
    console.log(error.message);
  }
};

//send reset password link to email
const sendResetPasswordMail = async (fullName, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "To reset password",
      html:
        "<p> Hi " +
        fullName +
        ', Please copy the link and <a href="http://localhost:8080/api/reset-password?token=' +
        token +
        '"> reset your password.</a>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent:- ", info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  registerUser: async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
      // Check if user already exists with the provided email
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
      const hashedPassword = await securePassword(password);

      // Create a new user model instance
      const newUser = new UserModel({
        fullName,
        email,
        password: hashedPassword,
      });

      //save new User
      const savedUser = await newUser.save();

      //send email verification
      await sendVerifyMail(fullName, email, savedUser._id);
      return res
        .status(201)
        .json({ message: "User registered successfully.", user: savedUser });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to register user.", error });
    }
  },
  verifyMail,

  //login code
  loginUser: async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(401)
          .json({
            message: "Authentication failed, Invalid email or password.",
          });
      }

      const isPassEqual = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPassEqual) {
        return res
          .status(401)
          .json({
            message: "Authentication failed, Invalid email or password.",
          });
      }
      const tokenObject = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      };
      const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
        expiresIn: "4h",
      });
      return res.status(200).json({ jwtToken, tokenObject });
    } catch (error) {
      console.error("Error occurred while logging in:", error);
      return res.status(500).json({ message: "Error", error });
    }
  },

  forget_password: async (req, res) => {
    try {
      const email = req.body.email;
      const userData = await UserModel.findOne({ email: email });
      if (userData) {
        const randomString = randomstring.generate();
        const data = await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        sendResetPasswordMail(userData.fullName, userData.email, randomString);
        res
          .status(200)
          .send({ success: true, msg: "Reset link sent to your email." });
      } else {
        res
          .status(200)
          .send({ success: true, msg: "This email doesn't exist." });
      }
    } catch (error) {
      console.log(error.message);
      res.status(400).send({ success: false, msg: error.message });
    }
  },

  reset_password: async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        const password = req.body.password;
        const newPassword = await securePassword(password);
        const userData = await UserModel.findByIdAndUpdate(
          { _id: tokenData._id },
          { $set: { password: newPassword, token: "" } },
          { new: true }
        );
        res.status(200).send({
          success: true,
          msg: "User password has been reset.",
          data: userData,
        });
      } else {
        res
          .status(200)
          .send({ success: true, msg: "This link has been expired." });
      }
    } catch (error) {
      res.status(400).send({ success: false, msg: error.message });
    }
  },

  //get all users
  getUsers: async (req, res) => {
    try {
      const users = await UserModel.find({}, { password: 0 });
      return res.status(200).json({ data: users });
    } catch (error) {
      return res.status(500).json({ message: "Error", error });
    }
  },

  //get User profile
  userProfile: async (req, res) => {
    try {
      // Access user information from req.user object
      const userId = req.user._id;

      // Retrieve the user data using the user ID
      const user = await UserModel.findById(userId, { password: 0 });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return the user profile data
      return res.status(200).json({ data: user });
    } catch (error) {
      console.error("Error occurred while fetching user profile:", error);
      return res.status(500).json({ message: "Error", error });
    }
  },

  //update user data
  updateUserData: async (req, res) => {
    try {
      const userId = req.user._id;
      const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }
      return res
        .status(200)
        .json({ message: "User updated successfully.", data: updatedUser });
    } catch (error) {
      return res.status(404).json({ message: "User not found.", error });
    }
  },

  //update password
  changePassword: async (req, res) => {
    try {
      // Extract user ID from the request
      const userId = req.user._id;

      // Retrieve the user from the database
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Check if the provided current password matches the stored password
      const isCurrentPasswordValid = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect." });
      }

      // Encrypt the new password
      const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);

      // Update the user's password
      user.password = newPasswordHash;
      await user.save();

      return res
        .status(200)
        .json({ message: "Password changed successfully." });
    } catch (error) {
      console.error("Error occurred while changing password:", error);
      return res.status(500).json({ message: "Error", error });
    }
  },
};
