import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import "./config/mongo.js";
import produtosRoute from "./routes/produtos.js";
import webHookRoute from "./routes/webhook.js"

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/produtos", produtosRoute);
app.use("/webhook", webHookRoute);


app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));