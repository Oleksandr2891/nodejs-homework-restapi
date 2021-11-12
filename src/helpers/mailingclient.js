const nodemailer = require("nodemailer");

const { getConfig } = require("../../config");

class MailingClient {
  async sendVerificationEmail(email, verifyToken) {
    const { authEmail, api } = getConfig();
    const verificationUrl = `${api.url}/users/verify/${verifyToken}`;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: authEmail.email,
        pass: authEmail.password,
      },
    });

    await transporter.sendMail({
      from: authEmail.email,
      to: email,
      subject: "Please verify your email",
      html: `<a href="${verificationUrl}">verify now</a>`,
    });
  }
}

exports.mailingClient = new MailingClient();
