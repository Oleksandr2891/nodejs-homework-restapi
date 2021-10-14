const express = require("express");
const logger = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const app = require("../app");
const contactsRouter = require("../routes/api/contacts.controller");

const PORT = process.env.PORT || 4040;
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

class Server {
  constructor() {
    this.server = null;
  }
  async start() {
    this.server = app;
    this.initMiddlewares();
    this.initRoutes();
    this.listen();
    this.initErrorHandling();
  }

  initMiddlewares() {
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

  listen() {
    this.server.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  }
}

const server = new Server();
server.start();
