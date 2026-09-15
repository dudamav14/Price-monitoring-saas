# ⚙️ Market Intelligence SaaS - Backend API (Node.js + TypeScript)

API RESTful principal do **SaaS de Inteligência de Mercado**, construída em **Node.js** com **TypeScript** seguindo os princípios de **Clean Architecture** e conectada ao banco de dados relacional **PostgreSQL**.

---

## 🛠️ Stack Tecnológica

- **Runtime & Linguagem:** Node.js (v20+) & TypeScript (v5+)
- **Framework Web:** Express.js
- **Banco de Dados:** PostgreSQL (com o driver `pg`)
- **Execução & Live Reload:** `tsx`
- **Validação & Ambiente:** `dotenv`

---

## 📂 Estrutura de Camadas (Clean Architecture)

```text
src/
├── config/          # Pool de conexões do PostgreSQL e variáveis de ambiente
├── repositories/    # Consultas SQL preparadas e desacopladas
├── services/        # Regras de negócio e calculadoras de métricas executivas
├── controllers/     # Handlers de rotas e formatação de respostas JSON
├── routes/          # Contratos de rotas HTTP versionadas (/api/v1)
├── middlewares/     # Captura de erros e logs de requisições HTTP
├── app.ts           # Configuração de middlewares do Express
└── server.ts        # Ponto de entrada e escuta na porta 3000
```

---

## 🚀 Como Executar Localmente

### 1. Instalar as dependências:
```bash
npm install
```

### 2. Executar no modo de desenvolvimento:
```bash
npm run dev
```

### 3. Compilar para produção:
```bash
npm run build
npm start
```

---

## 📑 Endpoints da API

- **Health Check:** `GET /api/v1/health`
- **Listar Produtos:** `GET /api/v1/products`
- **Detalhes do Produto:** `GET /api/v1/products/:id`
- **Histórico Temporal de Preços:** `GET /api/v1/products/:id/history`
- **Análise de Sentimento (IA):** `GET /api/v1/products/:id/sentiment`
- **Métricas do Dashboard:** `GET /api/v1/analytics/dashboard`
- **Gatilho do Scraper & IA:** `POST /api/v1/pipeline/trigger`
