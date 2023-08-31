const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
cloudinary.config({
  cloud_name: "dgmd8bmgm",
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const register = async (req, res) => {
  const { firstName, lastName, email, username, password, phone } = req.body;

  if (!firstName || !lastName || !email || !username || !password || !phone) {
    res.status(400);
    res.json({
      message: "all fields are required",
    });
  }
  const userAvailability = await User.findOne({ email });

  const hashPassword = await bcrypt.hash(password, 10);
  if (userAvailability) {
    res.status(400);
    res.json({
      message: "User already registered",
    });
  }
  const image = (await cloudinary.uploader.upload(req.file.path)).public_id(
    "profile_pic"
  );

  if (!image) {
    res.status(400).json({
      message: "Image could not be uploaded",
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    username,
    password: hashPassword,
    profile_pic: image.secure_url,
  });
  if (!user) {
    res.status(400).json({
      message: "User could not be created",
    });
  }
  res.status(201).json({
    message: "User successfully created",
    data: user,
  });
};
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    res.json({
      message: "all fields are required",
    });
  }
  const user = await User.findOne({ username });

  if (username && bcrypt.compareSync(password, user.password)) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          password: user.password,
          id: user.id,
        },
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "5h" }
    );
    res.status(200).json({
      message: "User successfully logged in",
      token: accessToken,
      data: user,
    });
  } else {
    res.status(400);
    res.json({
      message: "Username or Password is incorrect",
    });
  }
};

const currentUser = (req, res) => {
  res.status(200).json(req.user);
};

const profile = async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  if (!user) {
    res.status(200).json({ message: "User not founds" });
  }
  res.status(200).json(user);
};

const forgotPassword = async (req, res) => {
  function generateToken(payload) {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1h" });
  }

  // Function to send password reset email
  function sendPasswordResetEmail(email, resetToken) {
    const transporter = nodemailer.createTransport({
      // Set up your email provider configuration
      // ...
      service: "gmail",
      auth: {
        user: "demsdems28@gmail.com",
        pass: `${process.env.GMAIL_PASS}`,
      },
    });

    const mailOptions = {
      from: "demsdems28@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Please click the following link to reset your password: ${resetToken}`,
    };

    return transporter.sendMail(mailOptions);
  }

  const { email } = req.body;
  const userAvailability = await User.findOne({ email });

  if (!userAvailability) {
    res.status(400);
    res.json({
      message: "User not found",
    });
    process.exit(1);
  }
  // Generate a JWT token for password reset
  const resetToken = generateToken({ email });

  // Send the password reset link to the user's email
  const sendMail = await sendPasswordResetEmail(email, resetToken);

  res.json({ message: "Password reset email sent", data: sendMail });
};
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        console.error(err);
        res.status(400).json({ message: "Invalid or expired token" });
      } else {
        // Update the user's password in your database
        const { email } = decoded;
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        // Save the new password to your database
        // ...
        const user = await User.findOneAndUpdate(
          { email },
          { password: hashedPassword },
          { new: true }
        );
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Password reset successful", data: user });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
  currentUser,
  profile,
  forgotPassword,
  resetPassword,
};
