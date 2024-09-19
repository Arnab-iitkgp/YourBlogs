const { Router } = require("express");
const user = require("../model/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});
router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  // console.log(req.body);
  const { fullName, email, password } = req.body;
  const theUser = await user.create({
    fullName,
    email,
    password,
  });
  // (theUser);
  return res.redirect("/");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await user.matchPasswordAndGenToken(email, password);
    // console.log(token);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});
router.get("/logout", async (req, res) => {
  res.clearCookie("token").redirect("/");
});
module.exports = router;
