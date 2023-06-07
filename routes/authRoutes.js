const express = require("express");
const multer = require("multer");
const { register, login,  currentUser, profile, resetPassword, forgotPassword } = require("../controllers/authController");
const validateToken = require("../middleware/validateToken");
const upload = multer({dest:"uploads/"})


const router = express.Router()


router.post("/register",upload.single("profile_pic"), register )
router.route("/login").post(login)
router.route("/current-user").get(validateToken, currentUser)
router.route("/profile").get(validateToken, profile)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports=router