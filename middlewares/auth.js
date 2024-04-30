const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.token;

  try {
    const verifyResult = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      email: verifyResult.email,
    };

    next();
  } catch (e) {
    throw new Error("Invalid token");
  }
}

module.exports = auth;
