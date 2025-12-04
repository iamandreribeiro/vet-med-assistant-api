import { Produto } from "../models/produto.js";

export const buscarDadosProduto = async (termo) => {
  const produto = await Produto.findOne({
    descricao: { $regex: termo, $options: "i" }
  });

  return produto;
};

export const listarTodosProdutos = async () => {
  const produtos = await Produto.find({}, 'descricao');
  return produtos;
};