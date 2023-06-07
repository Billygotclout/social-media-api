const Post = require("../models/Post");


const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dgmd8bmgm",
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const getPosts = async (req, res) => {
  const posts = await Post.find({ user_id: req.user.id });
  if (!posts) {
    res.status(400).json({
      message: "Post not found",
    });
  }
  res.status(200).json({
    message: "Posts successfully fetched",
    data: posts,
  });
};

const createPost = async (req, res) => {
  const { caption } = req.body;
  if (!caption) {
    res.status(400);
    res.json({
      message: "all fields are required",
    });
  }
  const image = await cloudinary.uploader.upload(req.file.path);
  if (!image) {
    res.status(400).json({
      message: "Image could not be uploaded",
    });
  }
  const post = await Post.create({
    user_id: req.user.id,
    caption,
    post_image: image.secure_url,
    likes: 0
  });
  if (!post) {
    res.status(400).json({
      message: "Post could not be created",
    });
  }
  res.status(201).json({
    message: "Post successfully created",
    data: post,
  });
};

const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400).json({
      message: "Post could not be found",
    });
    process.exit(0)

  }
  res.status(200).json({
    message: "Post successfully found",
    data: post,
  });
};
const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400).json({
      message: "Post could not be found",
    });
  }
  if (post.user_id.toString() !== req.user.id) {
    res.status(403).json({
      message: "Not Allowed",
    });
  }
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    message: "Post successfully updated",
    data: updatedPost,
  });
  
};
const deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(400).json({
        message: "Post could not be found",
      });
    }
    if (post.user_id.toString() !== req.user.id) {
      res.status(403).json({
        message: "Not Allowed",
      });
    }
    await Posts.deleteOne({ _id: req.params.id });
  res.status(200).json({
    message: "Post successfully deleted",
  });
  };
  
module.exports = { getPosts, createPost, getPost, updatePost,deletePost };
