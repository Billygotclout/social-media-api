
const Post = require("../models/Post");
const User = require("../models/User");

const like = async (req, res) => {
  const user = await User.findById(req.user.id);
  const post = await Post.findById(req.params.id)

  const userLikes = post.likes;
  userLikes.push(user);

  await post.save()
  res.status(200).json({ message: "Liked", data: userLikes });
};
const viewLikes = async (req, res) => {
    const post = await Post.findById({user_id: req.user.id});
    console.log(post);
    const userLikes = post.likes;
    res.status(200).json(userLikes);
  };
  

module.exports= {like,viewLikes}