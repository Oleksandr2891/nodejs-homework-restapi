const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { getConfig } = require("../../config");
const User = require("./users.model");

exports.authorize = () => {
  return async (req, res, next) => {
    try {
      const authHeader = req.get("Authorization");
      if (!authHeader) {
        throw new Unauthorized();
      }
      const token = authHeader.replace("Bearer ", "");
      const config = getConfig();
      const payload = jwt.verify(token, config.jwt.secret);
      const user = await User.findById(payload.sub);
      if (!user) {
        throw new Unauthorized();
      }
      if (token !== user.token) {
        throw new Unauthorized();
      }

      req.user = user;
      next();
    } catch (err) {
      const statusCode = err.status || 401;
      return res.status(statusCode).send();
    }
  };
};
