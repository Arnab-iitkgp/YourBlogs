const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const router = Router();
const Blog = require("../model/blog");
const Comment = require("../model/comment");
router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req.user });
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });
router.post("/", upload.single("coverPhoto"), async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.get("/:blogId", async (req, res) => {
  const blog = await Blog.findById(req.params.blogId).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.blogId }).populate(
    "createdBy"
  );
  // console.log("blog:", blog);
  // console.log(comments);
  return res.render("blog", { user: req.user, blog: blog, comments });
});
router.post("/comment/:Id", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.Id,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.Id}`);
});
module.exports = router;
