import { Router } from "express";

const router = Router();

router.get("/", (request, response) => response.send("API Status: Online!"));

export { router };
