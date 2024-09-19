const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.webp",
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  //
  this.salt = salt;
  this.password = hashedPassword;
  next();
});
//
userSchema.static("matchPasswordAndGenToken", async function (email, password) {
  // try {
  const user = await this.findOne({ email });
  // console.log(user);
  if (!user) throw new Error("user Not Found");
  const salt = user.salt;
  const hashedPassword = user.password;
  const userProvideHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  if (userProvideHash !== hashedPassword)
    throw new Error("incorrect Passsword");
  const token = createTokenForUser(user);
  // return { ...user, password: undefined, salt: undefined };
  return token;
  // }
  // } catch (error) {
  //   console.log("Error Found");
  //   console.log(error);
  // }
});
const User = model("user", userSchema);

module.exports = User;
