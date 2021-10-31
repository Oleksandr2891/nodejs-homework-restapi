const express = require("express");
const logger = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const app = require("../../app");
const contactsRouter = require("../routes/api/contacts.controller");
const authRouter = require("../routes/api/users.controller");
const mongoose = require("mongoose");
const { getConfig } = require("../../config");

const STATIC_DIR = path.join(__dirname, "../public/avatars");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

dotenv.config();

class Server {
  constructor() {
    this.server = null;
  }
  async start() {
    this.server = app;
    this.initConfig();
    this.initMiddlewares();
    this.connectToDb();
    this.initRoutes();
    this.listen();
    this.initErrorHandling();
  }

  initConfig() {
    dotenv.config({ path: path.join(__dirname, "../.env") });
  }

  initMiddlewares() {
    this.server.use("/avatars", express.static(STATIC_DIR));
    this.server.use(express.json());
    this.server.use(logger(formatsLogger));
    this.server.use(
      cors({
        origin: "*",
      })
    );
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsRouter);
    this.server.use("/users", authRouter);
  }

  initErrorHandling() {
    this.server.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      return res.status(statusCode).send({
        name: err.name,
        status: statusCode,
        message: err.message,
      });
    });
  }

  async connectToDb() {
    const { database } = getConfig();
    try {
      await mongoose.connect(database.url);
      console.log("Database connection successful");
    } catch (err) {
      console.log("Database connection error", err);
      process.exit(1);
    }
  }

  listen() {
    const { api } = getConfig();
    this.server.listen(api.port, () => {
      console.log(`Server running. Use our API on port: ${api.port}`);
    });
  }
}

const server = new Server();
server.start();
