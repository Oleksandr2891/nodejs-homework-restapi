const { Unauthorized } = require("http-errors");
const path = require("path");
const FsPromises = require("fs").promises;
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const { getConfig } = require("../../config");
const User = require("./users.model");

const STATIC_DIR = path.join(__dirname, "../public/avatars");

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

exports.compressImage = () => {
  return async (req, res, next) => {
    const draftFilePath = req.file.path;
    const file = await Jimp.read(draftFilePath);
    const compressedPath = path.join(STATIC_DIR, req.file.filename);

    await file.resize(256, 256).writeAsync(compressedPath);

    await FsPromises.unlink(draftFilePath);

    req.file.destination = STATIC_DIR;
    req.file.path = compressedPath;

    next();
  };
};
