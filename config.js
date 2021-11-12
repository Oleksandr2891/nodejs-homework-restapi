exports.getConfig = function () {
  const {
    PORT,
    MONGO_URL,
    BCRYPT_SALT_ROUNDS,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    NODEMAILER_EMAIL,
    NODEMAILER_PASS,
    SERVER_URL,
  } = process.env;

  return {
    api: {
      port: PORT,
      saltRounds: parseInt(BCRYPT_SALT_ROUNDS),
      url: SERVER_URL,
    },
    jwt: {
      secret: JWT_SECRET,
      expiresIn: JWT_EXPIRES_IN,
    },
    database: { url: MONGO_URL },
    authEmail: {
      email: NODEMAILER_EMAIL,
      password: NODEMAILER_PASS,
    },
  };
};
