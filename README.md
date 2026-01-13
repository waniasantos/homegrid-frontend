# HomeGrid — Frontend

**HomeGrid Frontend** é uma aplicação React (Vite) para visualização e gerenciamento de dados do sistema HomeGrid. Este README descreve as funcionalidades, tecnologias usadas e instruções rápidas para executar o projeto localmente.

## Integrantes

Ezequiel Santos @ezequielsan 
Graziella Lima @grazi-rdl
Thamires Taboza @thamitaboza
Wania Santos @waniasantos

---

## ✨ Funcionalidades principais

- **Dashboard:** Visão geral com gráficos e indicadores (usa `recharts`).
- **Alertas:** Tela para listar e gerenciar alertas do sistema.
- **Anomalias:** Listagem e detalhes de anomalias detectadas.
- **Relatórios:** Visualização/geração de relatórios.
- **Configurações:** Ajustes de preferências e integração.
- **Componentes reutilizáveis:** `Modal`, `Toast`, `StatusBadges`, `Layout`, entre outros.
- **Integração com API:** Uso de `axios` e utilities em `src/lib` (`api.js`, `fetcher.js`, `storage.js`).
- **Modo mock:** Possibilidade de rodar com dados mockados para desenvolvimento (`src/lib/mockApi.js`).

---

## 🧰 Stack / Dependências

- **Framework:** React 19
- **Bundler / Dev server:** Vite
- **Estilização:** Tailwind CSS
- **Estado / Queries:** @tanstack/react-query
- **Gráficos:** Recharts
- **Rotas:** react-router-dom
- **HTTP client:** axios
- **Ícones:** lucide-react

---

## ⚙️ Requisitos

- Node.js 18+ (recomendado)
- npm ou yarn

---

## 🚀 Como executar (desenvolvimento)

1. Clone o repositório e entre na pasta do frontend:

```bash
cd homegrid-frontend
```

2. Instale as dependências:

```bash
npm install
# ou
# yarn
```

3. Configure variáveis de ambiente (opcional): crie um arquivo `.env` na raiz com as variáveis abaixo ou ajuste as existentes.

```env
VITE_USE_MOCK=false      # true para usar dados mockados (src/lib/mockApi.js)
VITE_API_URL=https://seu-endpoint-api.example.com
```

4. Execute em modo de desenvolvimento com HMR:

```bash
npm run dev
# ou
# yarn dev
```

Abra http://localhost:5173 (ou a porta indicada no terminal).

---

## 🛠 Scripts úteis

- `npm run dev` — Inicia servidor de desenvolvimento (Vite)
- `npm run build` — Gera build de produção em `dist/`
- `npm run preview` — Serve a build localmente para pré-visualização
- `npm run lint` — Executa o ESLint na base do projeto

---

## 📁 Estrutura relevante do projeto

- `src/pages/` — Telas: `Dashboard`, `Alertas`, `Anomalias`, `Relatorios`, `Configuracoes`
- `src/components/` — Componentes UI reutilizáveis
- `src/lib/` — Integração com API, `fetcher`, `mockApi`, `storage`, hooks (e.g., `useAsync`)
- `public/` — Arquivos estáticos

---

## 🧪 Modo Mock

Para ativar o modo de mock (útil para desenvolvimento sem backend disponível), defina em `.env`:

```env
VITE_USE_MOCK=true
```

Ao iniciar com `npm run dev`, o app usará `src/lib/mockApi.js` para respostas simuladas.

---

## 🧩 Build & Deploy

1. Gere a build:

```bash
npm run build
```

2. Faça deploy da pasta `dist/` em qualquer hospedagem de site estático (Netlify, Vercel, S3, etc.).

3. Para testar localmente a build gerada:

```bash
npm run preview
---

