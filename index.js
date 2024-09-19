const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./model/blog");

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthCookie } = require("./middlewares/authentication");
const app = express();
const PORT = 8000;
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthCookie("token"));
app.use(express.static(path.resolve("./public")));
mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then((e) => console.log("mongodb connnected"));
app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", { user: req.user, blogs: allBlogs });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
