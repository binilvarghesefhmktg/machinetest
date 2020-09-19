const jwt = require("jsonwebtoken");

const HttpError = require("../helper/httpError");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN' Header 
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, "BINILVARGHESE");
    req.userData = { userId: decodedToken.userId };
    req.token = token;
    next();
  } catch (err) {
    HttpError(res, 403, {
      message: "Authentication failed",
    });
    return;
  }
};
