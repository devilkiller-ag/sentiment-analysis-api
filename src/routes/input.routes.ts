import express from "express";
import { storeSentences } from "#controllers/input.controllers.js";

const router = express.Router();
router.post("/input", storeSentences);

export default router;
