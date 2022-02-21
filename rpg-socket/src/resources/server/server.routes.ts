import express from "express";

const serverRouter = express.Router();

serverRouter.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

export { serverRouter };
