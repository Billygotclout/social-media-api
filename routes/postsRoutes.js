const express = require("express");
const multer = require("multer")
const { getPosts, createPost, getPost, updatePost, deletePost } = require("../controllers/postsController");
const validateToken = require("../middleware/validateToken");
const { like, viewLikes } = require("../controllers/likesController");
const { follow } = require("../controllers/followersController");

const upload = multer({dest:"uploads/"})

const router = express.Router()

router.use(validateToken)
router.route("/get-posts").get( getPosts)
router.route("/create-post").post(upload.single("post_image"),createPost)
router.route("/get-post/:id").get(getPost)
router.route("/update-post/:id").put(updatePost)
router.route("/delete-post/:id").delete(deletePost)
router.route("/like/:id").post(like)
router.route("/view-likes").get(viewLikes)
router.route("/follow").post(follow)

module.exports=router