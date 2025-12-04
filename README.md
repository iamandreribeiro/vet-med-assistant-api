# vet-med-assistant-api
Uma API que simula um agente virtual capaz de identificar medicamentos em mensagens naturais, buscar artigos no PubMed e consultar preço e estoque no banco de dados, mantendo o contexto da conversa por meio de tokens JWT.
## ⚙️ Tecnologias Utilizadas
- Node.js + Express
- MongoDB + Mongoose
- Axios (integração PubMed)
- JWT
- Joi
- CORS
- dotenv
## 🗄️ Importando dados do arquivo .csv
```
mongoimport --db DBNAME --collection produtos --type csv --headerline --file arquivo.csv
```
Explicação dos parâmetros:<br>
`--db DBNAME` nome do banco<br>
`--collection produtos` nome da coleção onde os dados vão ficar<br>
`--type csv` tipo do arquivo<br>
`--headerline` usa a primeira linha do CSV como nome dos campos<br>
`--file arquivo.csv` path do arquivo CSV
## 🔧 Configuração do Ambiente
### Passo a Passo<br>
Clone o repositório:<br>
```
git clone https://github.com/iamandreribeiro/vet-med-assistant-api.git
```
Instale as dependências:<br>
```
npm install
```
Crie seu arquivo .env com as variáveis de ambiente:<br>
`PORT` Porta onde o servidor local irá rodar (ex.: 3000)<br>
`MONGO_URI` Connection string do MongoDB (ex.: string gerada no Mongo Atlas)<br>
`DBNAME` Nome do banco de dados a ser utilizado<br>
`SECRET` Chave secreta usada para assinar e validar tokens JWT<br>
Execute o servidor:<br>
```
npm start
```
## 🔌 Documentação da API
GET /produtos<br>
Retorna a lista completa de produtos (medicamentos).<br>
Exemplo de resposta:
```
[
  {
    "descricao": "Amoxicilina 500mg (Antibiótico)",
    "preco": 25.9,
    "estoque": 150
  },
  {
    "descricao": "Dipirona Sódica Vet 20ml",
    "preco": 12.9,
    "estoque": 200
  }, ...
]
```
GET /produtos/:id<br>
Busca um produto pelo seu _id.<br>
Exemplo de resposta:
```
{
  "descricao": "Amoxicilina 500mg (Antibiótico)",
  "preco": 25.9,
  "estoque": 150
}
```
## 🤖 Webhook (Agente Bolota)
POST /webhook<br>
Recebe uma mensagem do usuário e retorna a resposta do agente.<br>
Exemplo de requisição:<br>
Usuário pergunta sobre um medicamento:
```
{
    "mensagem": "Me fale sobre Amoxicilina para cães"
}
```
O agente então:
1. Identifica o medicamento citado
2. Consulta e traz artigos do PubMed
3. Retorna um texto explicativo com os achados e pergunta se o usuário quer ver preço/estoque
4. Gera e retorna um token JWT contendo o nome/ID do medicamento.

Exemplo de resposta:
```
{
    "texto": "A **Amoxicilina** é muito utilizada na veterinária!\nEncontrei 5 artigos sobre Amoxicilina no PubMed...
...Posso verificar o preço e estoque para você?",
    "token": "eyJhbGciOi..."
}
```
Exemplo de requisição com token:<br>
O usuário envia a intenção de consultar preço/estoque junto ao token relativo ao medicamento.
```
{
    "mensagem": "Ver preço",
    "token": "eyJhbGciOi..."
}
```
O agente então:
1. Consulta a API local e retorna preço e quantidade em estoque
2. Faz o alerta de "Uso somente com prescrição veterinária".

Exemplo de resposta:
```
{
    "texto": "Aqui está! Encontrei ** Amoxicilina 500mg (Antibiótico) **.\n💰 Preço: R$ 25.9\n📦 Estoque: 150 unidades.",
    "alerta": "⚠️IMPORTANTE⚠️: O uso deste medicamento requer prescrição veterinária obrigatória. Consulte seu veterinário!",
    "token": "eyJhbGciOi..."
}
```
