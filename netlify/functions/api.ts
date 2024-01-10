// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();
const router = Router();

router.get("/hello", (req, res) => res.send("Hello Aaron!"));
router.get("/hi", (req, res) => res.send("Hi Aaron!"));
router.post("/hola", (req, res) => {
  const body = req.body;
  res.send(body);
});

api.use("/api/", router);

export const handler = serverless(api);
