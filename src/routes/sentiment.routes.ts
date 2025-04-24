import express from "express";
import { processSentiments } from "#controllers/sentiment.controllers.js";

const router = express.Router();
router.get("/sentiments", processSentiments);

export default router;
