# 🎬 CinemaStore - Loja de Filmes E-commerce

## Descrição do Projeto

CinemaStore é uma plataforma de e-commerce especializada na venda de filmes em versão digital. O projeto consiste em um sistema completo com autenticação de usuários, catálogo de produtos, carrinho de compras e um painel administrativo com CRUD completo para gerenciamento de filmes.

## 📋 Objetivo

Desenvolver um site institucional com módulo de gerenciamento de conteúdo (CRUD) que permita a administradores criar, ler, atualizar e deletar filmes do catálogo, enquanto usuários comuns podem navegar, comprar e acessar sua biblioteca pessoal.

## 🛠️ Stack Tecnológico

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React** | 18+ | Frontend - Interface de usuário |
| **TypeScript** | 5.x | Tipagem estática no frontend |
| **Node.js** | 18+ | Backend - API REST |
| **Express** | 4.x | Framework web backend |
| **PostgreSQL** | 14+ | Banco de dados relacional |
| **Tailwind CSS** | 3.x | Estilização e design responsivo |

## 📁 Estrutura do Projeto

```
cinema-store/
├── frontend/                 # Aplicação React + TypeScript
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas principais
│   │   ├── services/        # Chamadas à API
│   │   ├── types/           # Tipos TypeScript
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                  # API Node.js + Express
│   ├── src/
│   │   ├── controllers/      # Lógica de negócio
│   │   ├── routes/          # Rotas da API
│   │   ├── models/          # Modelos do banco de dados
│   │   ├── middleware/      # Autenticação, validação
│   │   └── server.ts
│   └── package.json
│
├── database/                 # Scripts SQL
│   └── init.sql             # Criação das tabelas
│
└── README.md
```

## ✅ Checklist do Projeto

### Backend (Node.js + Express)

- [ ] Configurar projeto Node.js com TypeScript
- [ ] Instalar e configurar Express
- [ ] Conectar ao banco de dados PostgreSQL
- [ ] Criar modelos/tabelas (Usuários, Filmes, Compras)
- [ ] Implementar autenticação JWT
- [ ] Criar rota de registro de usuários
- [ ] Criar rota de login de usuários
- [ ] **CRUD de Filmes (Admin)**
  - [ ] GET /api/filmes - Listar todos os filmes
  - [ ] GET /api/filmes/:id - Obter filme específico
  - [ ] POST /api/filmes - Criar novo filme
  - [ ] PUT /api/filmes/:id - Atualizar filme
  - [ ] DELETE /api/filmes/:id - Deletar filme
- [ ] Criar rota de carrinho de compras
- [ ] Criar rota de checkout/finalizar compra
- [ ] Criar rota de histórico de compras do usuário
- [ ] Implementar middleware de autenticação
- [ ] Implementar middleware de permissão (admin)
- [ ] Documentar API (Swagger/OpenAPI opcional)

### Frontend (React + TypeScript + Tailwind)

- [ ] Criar projeto React com TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Implementar sistema de autenticação
  - [ ] Página de login
  - [ ] Página de registro
  - [ ] Armazenar token JWT (localStorage)
- [ ] Criar layout base
  - [ ] Header/Navbar
  - [ ] Footer
  - [ ] Sidebar (opcional)
- [ ] Página inicial (Home)
  - [ ] Exibir catálogo de filmes
  - [ ] Filtros por gênero, preço
  - [ ] Busca por título
- [ ] Página de detalhes do filme
  - [ ] Exibir informações completas
  - [ ] Botão "Adicionar ao carrinho"
- [ ] Carrinho de compras
  - [ ] Listar itens do carrinho
  - [ ] Remover itens
  - [ ] Calcular total
  - [ ] Botão de checkout
- [ ] Página de checkout
  - [ ] Resumo do pedido
  - [ ] Simular pagamento
  - [ ] Confirmação de compra
- [ ] Minha Biblioteca
  - [ ] Exibir filmes comprados
  - [ ] Opção de assistir/baixar (simulado)
- [ ] Painel Admin
  - [ ] Dashboard admin
  - [ ] Listagem de filmes com CRUD
  - [ ] Formulário de criação de filme
  - [ ] Formulário de edição de filme
  - [ ] Botão de deletar filme
  - [ ] Validação de formulários
- [ ] Responsividade (mobile, tablet, desktop)
- [ ] Temas e paleta de cores consistente

### Banco de Dados (PostgreSQL)

- [ ] Criar tabela `usuarios` (id, email, senha, nome, data_criacao, role)
- [ ] Criar tabela `filmes` (id, titulo, descricao, genero, preco, capa_url, duracao, ano, data_criacao)
- [ ] Criar tabela `carrinho` (id, usuario_id, filme_id, quantidade)
- [ ] Criar tabela `compras` (id, usuario_id, total, data_compra, status)
- [ ] Criar tabela `itens_compra` (id, compra_id, filme_id, preco)
- [ ] Criar indices nas colunas de busca frequente
- [ ] Seed inicial com filmes de exemplo

### Segurança

- [ ] Hash de senhas (bcrypt)
- [ ] Validação de inputs
- [ ] CORS configurado
- [ ] Proteção de rotas admin
- [ ] Validação de JWT

### Testes e Deploy

- [ ] Testes unitários (opcional)
- [ ] Testes de integração (opcional)
- [ ] Deploy backend (Heroku, Render, etc)
- [ ] Deploy frontend (Vercel, Netlify, etc)

## 🚀 Como Iniciar o Projeto

### Pré-requisitos
- Node.js v18+
- PostgreSQL instalado
- Git

### Setup Inicial

```bash
# Clonar repositório
git clone <seu-repo>
cd cinema-store

# Backend
cd backend
npm install
npm run dev

# Frontend (em outro terminal)
cd ../frontend
npm install
npm start
```

## 📊 Modelo de Dados (Resumido)

```
USUARIOS
├── id (PK)
├── email (UNIQUE)
├── senha (hashed)
├── nome
├── role (user/admin)
└── data_criacao

FILMES
├── id (PK)
├── titulo
├── descricao
├── genero
├── preco
├── capa_url
├── duracao
├── ano
└── data_criacao

COMPRAS
├── id (PK)
├── usuario_id (FK)
├── total
├── data_compra
└── status

ITENS_COMPRA
├── id (PK)
├── compra_id (FK)
├── filme_id (FK)
└── preco
```

## 👥 Roles e Permissões

| Papel | Permissões |
|-------|-----------|
| **Usuário** | Ver catálogo, comprar filmes, acessar biblioteca |
| **Admin** | Tudo do usuário + CRUD completo de filmes |

## 📝 Endpoints Principais (API)

```
POST   /api/auth/register     - Registrar usuário
POST   /api/auth/login        - Fazer login
GET    /api/filmes            - Listar filmes
GET    /api/filmes/:id        - Obter filme
POST   /api/filmes            - Criar filme (admin)
PUT    /api/filmes/:id        - Atualizar filme (admin)
DELETE /api/filmes/:id        - Deletar filme (admin)
POST   /api/carrinho          - Adicionar ao carrinho
GET    /api/carrinho          - Obter carrinho
POST   /api/compras           - Finalizar compra
GET    /api/compras           - Histórico de compras
```


