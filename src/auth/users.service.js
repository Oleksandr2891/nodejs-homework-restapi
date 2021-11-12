const User = require("./users.model");
const {
  Conflict,
  NotFound,
  Forbidden,
  PreconditionFailed,
} = require("http-errors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
var gravatar = require("gravatar");
const { mailingClient } = require("../helpers/mailingclient");
const { v4: uuidv4 } = require("uuid");
const { getConfig } = require("../../config");

class AuthService {
  async signUp(signUpDto) {
    const { email, password } = signUpDto;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Conflict("User with such email already exists");
    }
    const url = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mp",
    });
    const passwordHash = await this.hashPassword(password);
    const newUser = await User.create({
      email,
      password: passwordHash,
      avatarURL: url,
      verifyToken: uuidv4(),
    });
    await mailingClient.sendVerificationEmail(email, newUser.verifyToken);
    return newUser;
  }

  async signIn(signInDto) {
    const { email, password } = signInDto;
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFound("User with such email not found");
    }

    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Forbidden("Password is wrong");
    }

    if (user.verify !== true) {
      throw new PreconditionFailed("User is not verified");
    }

    const token = this.createToken({ sub: user.id });
    await User.findByIdAndUpdate(user.id, {
      $set: { token },
    });
    return { user, token };
  }

  async verifyUser(verificationToken) {
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw new NotFound("User not found");
    }
    await User.findByIdAndUpdate(user.id, {
      verify: true,
      verificationToken: null,
    });
  }

  async secondaryVerifyUser(body) {
    const { email } = body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFound("User not found");
    }
    if (user.verify === true) {
      throw new Forbidden("Verification has already been passed");
    }
    await mailingClient.sendVerificationEmail(email);
    return user;
  }

  async logout(user) {
    const userNew = await User.findByIdAndUpdate(
      user.id,
      {
        $set: { token: null },
      },
      { new: true }
    );
    return userNew;
  }

  async updateStatusUser(user, updateParams) {
    const { id } = user;
    const updateStatusUser = await User.findByIdAndUpdate(
      id,
      {
        $set: updateParams,
      },
      { new: true }
    );
    return updateStatusUser;
  }

  async updateAvatarUser(user, updateParams) {
    const { id } = user;
    const updateAvatarUrl = await User.findByIdAndUpdate(
      id,
      {
        $set: { avatarURL: updateParams.path },
      },
      { new: true }
    );
    return updateAvatarUrl;
  }

  async hashPassword(password) {
    const { api } = getConfig();
    return bcryptjs.hash(password, api.saltRounds);
  }

  async comparePassword(password, passwordHash) {
    return bcryptjs.compare(password, passwordHash);
  }

  createToken(payload) {
    const config = getConfig();
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }
}

exports.authService = new AuthService();
