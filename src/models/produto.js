import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  estoque: {
    type: Number,
    required: true
  }
}, {
  collection: "dadosProdutos"
});

export const Produto = mongoose.model("Produto", produtoSchema);