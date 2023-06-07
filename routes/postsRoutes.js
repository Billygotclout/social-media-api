const express = require("express");
const multer = require("multer")
const { getPosts, createPost, getPost, updatePost, deletePost } = require("../controllers/postsController");
const validateToken = require("../middleware/validateToken");
const { like } = require("../controllers/likesController");
const upload = multer({dest:"uploads/"})

const router = express.Router()

router.use(validateToken)
router.route("/get-posts").get( getPosts)
router.route("/create-post").post(upload.single("post_image"),createPost)
router.route("/get-post/:id").get(getPost)
router.route("/update-post/:id").put(updatePost)
router.route("/delete-post/:id").delete(deletePost)
router.route("/likes/:id").get(like)

module.exports=router