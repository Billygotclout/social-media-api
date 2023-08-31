const express = require("express");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;
dbConnect();

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postsRoutes"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
