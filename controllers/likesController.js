const Post = require("../models/Post");
const User = require("../models/User");

const like = async (req, res) => {
  const user = await User.findById(req.user.id);
  const post = await Post.findById(req.params.id);

  const userLikes = post.likes;
  userLikes.push(user);

  await post.save();
  res.status(200).json({ message: "Liked", data: userLikes });
};
const viewLikes = async (req, res) => {
  const post = await Post.findById({ user_id: req.user.id });
  console.log(post);
  const userLikes = post.likes;
  res.status(200).json(userLikes);
};
const unlike = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    // const product = await Product.findOne({ _id: req.params.id });

    const post = await Post.findById(req.params.id);

    const userLikes = post.likes;
    userLikes = userLikes.filter((item) => item.id != req.params.id);

    await user.save();
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { like, viewLikes, unlike };
