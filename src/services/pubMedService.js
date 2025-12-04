import axios from 'axios';

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

export const buscarDadosPubMed = async (termo) => {
  try {
    const searchUrl = `${BASE_URL}/esearch.fcgi?db=pubmed&term=${termo}&retmode=json&retmax=5`;
    const searchResponse = await axios.get(searchUrl);
    const ids = searchResponse.data.esearchresult.idlist;

    if (!ids || ids.length === 0) {
      return [];
    }

    const idsStr = ids.join(',');
    const summaryUrl = `${BASE_URL}/esummary.fcgi?db=pubmed&id=${idsStr}&retmode=json`;
    const summaryResponse = await axios.get(summaryUrl);
    const resultados = summaryResponse.data.result;

    delete resultados.uids;

    const artigosFormatados = Object.values(resultados).map(artigo => ({
      titulo: artigo.title,
      autores: artigo.authors ? artigo.authors.map(a => a.name).join(', ') : 'Não informado',
      fonte: artigo.source,
      pubdate: artigo.pubdate,
      link: `https://pubmed.ncbi.nlm.nih.gov/${artigo.uid}/`
    }));

    return artigosFormatados;

  } catch (error) {
    console.error("Erro ao buscar no PubMed:", error);
    throw new Error("Falha na integração com PubMed");
  }
};