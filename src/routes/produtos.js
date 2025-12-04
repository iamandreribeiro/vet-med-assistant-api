import { Router } from "express";
import { getProdutos, getProdutoById } from "../controllers/produtosController.js";

const router = Router();

router.get("/", getProdutos);
router.get("/:id", getProdutoById);

export default router;