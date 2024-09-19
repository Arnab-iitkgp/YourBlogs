const JWT = require("jsonwebtoken");

const SECRET = "Arnab@1233";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImage: user.profileImageURL,
    role: user.role,
    fullName: user.fullName,
  };
  const token = JWT.sign(payload, SECRET);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, SECRET);
  return payload;
}
module.exports = {
  validateToken,
  createTokenForUser,
};
