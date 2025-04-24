import { healthCheck } from "#controllers/health.controllers.js";
import express from "express";

const router = express.Router();

router.get("/health", healthCheck);

export default router;
