import { Produto } from "../models/produto.js";

export async function getProdutos(req, res) {
  try {
    const produtos = await Produto.find();
    return res.send(produtos);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getProdutoById(req, res) {
  const { id } = req.params;

  try {
    const produto = await Produto.findById(id);
    if (!produto) {
      return res.status(404).send('Produto não encontrado.');
    }
    return res.send(produto);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}