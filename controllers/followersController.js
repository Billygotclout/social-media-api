const User = require("../models/User");

const follow = async (req, res) => {
  const user = await User.findById(req.user.id);
  const userFollowers = user.followers;
  userFollowers.push({ id: user.id, username: user.username });

  await user.save();
  res.status(200).json({ message: "Followed", data: userFollowers });
};
const viewFollowers = async (req, res) => {
  const user = await User.findById(req.user.id);
  const userFollowers = user.followers;
  res.status(200).json(userFollowers);
};

const unfollow = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    // const product = await Product.findOne({ _id: req.params.id });

   
    user.followers= user.followers.filter((item) => item.id != req.params.id);

    await user.save();
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { follow, viewFollowers, unfollow };
