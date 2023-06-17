
const User = require("../models/User");

const follow = async (req, res) => {
  const user = await User.findById(req.user.id);
  const userFollowers = user.followers;
  userFollowers.push({id:user.id,username: user.username});

  await user.save();
  res.status(200).json({ message: "Followed", data: userFollowers});
};
const viewFollowers = async (req, res) => {
    const user = await User.findById(req.user.id);
    const userFollowers = user.wishlist;
    res.status(200).json(userFollowers);
  };
  

module.exports= {follow,viewFollowers}