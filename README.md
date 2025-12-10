# 🎬 CinemaStore - Loja de Filmes E-commerce

Uma plataforma de e-commerce para venda de filmes digitais, com autenticação de usuários, catálogo dinâmico, carrinho de compras e checkout.

---

## ⚡ Quick Start (5 minutos)

```bash
# 1. Instalar dependências
cd backend && npm install

# 2. Inicializar banco de dados
npm run init-db

# 3. Iniciar servidor
npm run dev

# 4. Abrir no navegador
# http://localhost:3000/
```

**Credenciais de Teste:**
- Admin: `admin@cinemastore.com` / `admin123`
- Usuário: `usuario@cinemastore.com` / `user123`

---

## 🛠️ Stack Tecnológica

| Tecnologia | Descrição |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js + Express + TypeScript |
| **Banco de Dados** | SQLite |
| **Autenticação** | JWT + Bcrypt |
| **API** | REST com CORS |

---

## 📁 Estrutura do Projeto

```
cinema-store/
├── frontend/src/                 # Frontend
│   ├── *.html                    # Páginas (login, register, catalogo, etc)
│   ├── api.js                    # Cliente da API
│   ├── Script.js                 # Lógica geral
│   ├── carrinho.js               # Lógica do carrinho
│   └── style.css                 # Estilos
│
├── backend/                      # Backend
│   ├── src/
│   │   ├── controllers/          # Lógica de negócio
│   │   ├── routes/               # Rotas da API
│   │   ├── middleware/           # Autenticação
│   │   ├── utils/                # Hash, JWT
│   │   ├── config/               # Banco de dados
│   │   ├── types/                # Tipos TypeScript
│   │   └── server.ts             # Servidor principal
│   ├── scripts/
│   │   └── initDb.ts             # Inicializador do BD
│   ├── init.sql                  # Schema do banco
│   └── package.json
│
└── README.md
```

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Git

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/WilianUno/cinema-store.git
cd cinema-store
```

### Passo 2: Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Inicializar banco de dados (cria database.db)
npm run init-db
```

Você verá:
```
✅ Banco de dados inicializado com sucesso!
👥 Usuários criados: 2
🎬 Filmes criados: 15

🔐 Credenciais de acesso:
   Admin: admin@cinemastore.com / admin123
   User:  usuario@cinemastore.com / user123
```

### Passo 3: Iniciar Servidor

```bash
npm run dev
```

O servidor estará disponível em: **http://localhost:3000**

---

## 📱 Páginas Disponíveis

| Página | URL | Descrição |
|--------|-----|-----------|
| Início | `/` | Página inicial com filmes em destaque |
| Catálogo | `/catalogo.html` | Todos os filmes com busca |
| Login | `/login.html` | Autenticação de usuários |
| Registro | `/register.html` | Criar nova conta |
| Carrinho | `/carrinho.html` | Carrinho de compras (requer login) |
| Checkout | `/checkout.html` | Finalizar compra (requer login) |

---

## 🔐 Autenticação

### Login (POST `/api/auth/login`)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cinemastore.com",
    "password": "admin123"
  }'
```

### Resposta
```json
{
  "message": "Login sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@cinemastore.com",
    "nome": "Administrador",
    "role": "admin"
  }
}
```

### Usar Token em Requisições
```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🎬 Endpoints da API

### Filmes
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/movies` | Listar todos os filmes |
| GET | `/api/movies/featured` | Filmes em destaque |
| GET | `/api/movies/upcoming` | Próximos lançamentos |
| GET | `/api/movies/search?q=termo` | Buscar filmes |
| GET | `/api/movies/category/:category` | Filtrar por gênero |
| GET | `/api/movies/:id` | Obter filme por ID |

### Autenticação
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrar novo usuário | ✗ |
| POST | `/api/auth/login` | Fazer login | ✗ |
| GET | `/api/auth/me` | Obter dados do usuário | ✓ |

### Carrinho (Requer Token)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/cart` | Ver carrinho |
| POST | `/api/cart` | Adicionar item |
| PUT | `/api/cart/update` | Atualizar quantidade |
| DELETE | `/api/cart/:id` | Remover item |
| DELETE | `/api/cart/clear` | Limpar carrinho |

### Saúde da API
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Status da API |
| GET | `/api/test-db` | Status do banco de dados |

---

## 📊 Banco de Dados

### Usuários (`usuarios`)
```sql
id INTEGER PRIMARY KEY
email TEXT UNIQUE NOT NULL
senha TEXT NOT NULL (bcryptjs)
nome TEXT NOT NULL
role TEXT DEFAULT 'user' ('user' ou 'admin')
data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Filmes (`filmes`)
```sql
id INTEGER PRIMARY KEY
titulo TEXT NOT NULL
descricao TEXT
genero TEXT
preco REAL NOT NULL
capa_url TEXT
duracao INTEGER
ano INTEGER
data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Carrinho (`carrinho`)
```sql
id INTEGER PRIMARY KEY
usuario_id INTEGER FOREIGN KEY
filme_id INTEGER FOREIGN KEY
quantidade INTEGER DEFAULT 1
data_adicao DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Compras (`compras`)
```sql
id INTEGER PRIMARY KEY
usuario_id INTEGER FOREIGN KEY
total REAL NOT NULL
data_compra DATETIME DEFAULT CURRENT_TIMESTAMP
status TEXT DEFAULT 'completed' ('pending', 'completed', 'cancelled')
```

---

## 🔧 Comandos Úteis

### Backend

```bash
# Iniciar em desenvolvimento
npm run dev

# Compilar TypeScript
npm run build

# Inicializar banco de dados
npm run init-db

# Iniciar servidor compilado
npm start
```

### Teste de Endpoints

```bash
# Health Check
curl http://localhost:3000/api/health

# Teste do Banco
curl http://localhost:3000/api/test-db

# Listar Filmes
curl http://localhost:3000/api/movies

# Filmes em Destaque
curl http://localhost:3000/api/movies/featured

# Buscar Filmes
curl "http://localhost:3000/api/movies/search?q=matrix"
```
