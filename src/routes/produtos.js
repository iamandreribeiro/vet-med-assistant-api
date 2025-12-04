import { Router } from "express";
import { processarMensagem } from "../controllers/webHookController.js";

const router = Router();

router.post("/webhook", processarMensagem);

export default router;