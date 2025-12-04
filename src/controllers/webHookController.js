import { buscarDadosPubMed } from "../services/pubMedService.js";
import { buscarDadosProduto, listarTodosProdutos } from "../services/produtoService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const processarMensagem = async (req, res) => {
  const { mensagem, token } = req.body;

  if (!mensagem) {
    return res.status(400).json({ erro: "Mensagem vazia." });
  }

  const textoUsuario = mensagem.toLowerCase();
  const todosProdutos = await listarTodosProdutos();
  let ultimoProduto = null;
  let produtoEncontrado = null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.SECRET);
      ultimoProduto = payload.ultimoProduto;
    } catch (err) {
      console.log("Token inválido ou expirado");
    }
  }
  if (ultimoProduto) {
    produtoEncontrado = todosProdutos.find(p =>
      p.descricao.toLowerCase().startsWith(ultimoProduto.toLowerCase())
    );
  }
  if (!produtoEncontrado) {
    produtoEncontrado = todosProdutos.find(produto => {
      const nomeSimplificado = produto.descricao.split(" ")[0].toLowerCase();
      return textoUsuario.includes(nomeSimplificado);
    });
  }

  const pediuInfo =
    textoUsuario.includes("preço") ||
    textoUsuario.includes("quanto custa") ||
    textoUsuario.includes("estoque") ||
    /\bsim\b/.test(textoUsuario);

  if (pediuInfo && !produtoEncontrado) {
    return res.json({
      texto: "Claro! Qual medicamento você deseja consultar o preço?",
      token
    });
  }
  if (!produtoEncontrado) {
    return res.json({
      agente: "Bolota 🐾",
      texto: "Desculpe, não entendi qual medicamento você procura. Tente dizer o nome como aparece na receita (ex: Amoxicilina, Apoquel, Simparic)."
    });
  }
  const termo = produtoEncontrado.descricao.split(' ')[0]; //"Amoxicilina"
  const novoToken = jwt.sign(
    { ultimoProduto: termo },
    process.env.SECRET,
    { expiresIn: "3d" }
  );

  if (pediuInfo) {
    const dadosProduto = await buscarDadosProduto(termo);
    let sTexto = `Aqui está! Encontrei ** ${dadosProduto.descricao} **.\n💰 Preço: R$ ${dadosProduto.preco}\n`;

    if (!dadosProduto.estoque) {
      sTexto += `😢 Infelizmente não há estoque deste produto!`;
    } else {
      sTexto += `📦 Estoque: ${dadosProduto.estoque} unidades.`;
    }

    return res.json({
      texto: sTexto,
      alerta: "⚠️IMPORTANTE⚠️: O uso deste medicamento requer prescrição veterinária obrigatória. Consulte seu veterinário!",
      token: novoToken
    });
  }

  const artigos = await buscarDadosPubMed(termo);
  const resumoArtigos = artigos.slice(0, 2).map(a => `📄 ${a.titulo} (${a.pubdate})`).join('\n');

  return res.json({
    texto: `A **${termo}** é muito utilizada na veterinária!\nEncontrei ${artigos.length} artigos sobre ${termo} no PubMed.${resumoArtigos}\n\nPosso verificar o preço e estoque para você?`,
    token: novoToken
  });
};