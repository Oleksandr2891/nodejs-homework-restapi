const User = require("./users.model");
const { Conflict, NotFound, Forbidden } = require("http-errors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getConfig } = require("../../config");

class AuthService {
  async signUp(signUpDto) {
    const { email, password } = signUpDto;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Conflict("User with such email already exists");
    }

    const passwordHash = await this.hashPassword(password);
    const newUser = await User.create({
      email,
      password: passwordHash,
    });
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

    const token = this.createToken({ sub: user.id });
    // const params = JSON.stringify({ token });
    await User.findByIdAndUpdate(user.id, {
      $set: { token },
    });
    console.log(`user`, { user, token });
    return { user, token };
  }

  async logout(user) {
    const userNew = await User.findByIdAndUpdate(
      user.id,
      {
        $set: { token: null },
      },
      { new: true }
    );
    console.log(`user`, userNew);
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
