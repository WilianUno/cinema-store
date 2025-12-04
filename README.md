# 🎬 CinemaStore - Loja de Filmes E-commerce

## Descrição do Projeto

CinemaStore é uma plataforma de e-commerce especializada na venda de filmes em versão digital. O projeto consiste em um sistema completo com autenticação de usuários, catálogo de produtos, carrinho de compras e um painel administrativo com CRUD completo para gerenciamento de filmes.

## 🛠️ Stack Tecnológica

| Tecnologia | Uso |
|-----------|-----|
| **React + TypeScript** | Frontend - Interface de usuário |
| **Node.js + Express** | Backend - API REST |
| **SQLite** | Banco de dados |
| **Tailwind CSS** | Estilização responsiva |
| **JWT + Bcrypt** | Autenticação e segurança |

## 📁 Estrutura do Projeto

```
cinema-store/
├── frontend/                 # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas (Home, Admin, etc)
│   │   ├── services/        # Chamadas à API
│   │   └── App.tsx
│   └── package.json
│
├── backend/                  # Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio + queries
│   │   ├── routes/          # Rotas da API
│   │   ├── middleware/      # Autenticação
│   │   ├── utils/           # Hash, JWT
│   │   └── server.ts
│   ├── scripts/
│   │   └── initDb.ts        # Script de inicialização
│   ├── init.sql             # Schema do banco
│   ├── database.db          # Banco SQLite (gerado automaticamente)
│   └── package.json
│
└── README.md
```

## 🚀 Como Iniciar o Projeto

### Pré-requisitos
- Node.js v18+
- Git

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd cinema-store
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo .env
cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
JWT_SECRET=cinema_store_super_secret_key_2024
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
EOF

# Inicializar banco de dados (cria database.db)
npm run init-db

# Iniciar servidor
npm run dev
```

### 3. Configurar Frontend

```bash
# Em outro terminal
cd frontend

# Instalar dependências
npm install

# Iniciar aplicação
npm run dev
```

### 4. Acessar o Sistema

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

#### Credenciais de Acesso

**Admin:**
```
Email: admin@cinemastore.com
Senha: admin123
```

**Usuário:**
```
Email: usuario@cinemastore.com
Senha: user123
```

## 📊 Banco de Dados

### Tabelas

- **usuarios** - id, email, senha, nome, role, data_criacao
- **filmes** - id, titulo, descricao, genero, preco, capa_url, duracao, ano
- **carrinho** - id, usuario_id, filme_id, quantidade
- **compras** - id, usuario_id, total, data_compra, status
- **itens_compra** - id, compra_id, filme_id, preco, quantidade
