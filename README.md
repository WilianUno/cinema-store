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

---

## 🎯 Funcionalidades

### ✅ Implementadas
- [x] Autenticação com JWT
- [x] Cadastro de usuários
- [x] Catálogo dinâmico de filmes (15 filmes)
- [x] Busca e filtro de filmes
- [x] Carrinho de compras
- [x] Checkout com formulário
- [x] Responsividade (Mobile)
- [x] Design moderno com animações
- [x] API REST completa
- [x] Banco SQLite pré-populado

### 🔜 Futuras Melhorias
- [ ] Histórico de compras
- [ ] Sistema de avaliações e comentários
- [ ] Wishlist/Favoritos
- [ ] Cupons de desconto
- [ ] Recomendações personalizadas
- [ ] Dashboard administrativo

---

## 🐛 Troubleshooting

### Erro: "Port 3000 already in use"
```bash
# Matar processo na porta 3000
lsof -i :3000
kill -9 <PID>

# Ou usar outra porta
PORT=3001 npm run dev
```

### Banco de dados vazio
```bash
# Remover banco antigo
rm backend/database.db

# Reinicializar
npm run init-db
```

### Filmes não aparecem
1. Abrir DevTools (F12) → Console
2. Testar endpoint: `curl http://localhost:3000/api/movies`
3. Verificar logs do servidor

### Login não funciona
1. Verificar credenciais (email e senha)
2. Abrir DevTools (F12) → Network
3. Ver resposta da requisição POST `/api/auth/login`
4. Verificar se o token está sendo armazenado no localStorage

### Imagens dos filmes não carregam
- As imagens vêm do TMDB (The Movie Database)
- Se tiver problema de conexão, pode aparecer placeholder cinza
- Isso é normal e não impede o funcionamento

---

## 🔐 Segurança

- Senhas são hashidas com **bcryptjs** (10 rounds)
- Autenticação com **JWT** (JSON Web Tokens)
- CORS configurado para porta local
- Validação de input em todas as rotas
- Foreign keys habilitadas no SQLite

---

## 📝 Arquivos Importantes

### Frontend
- `api.js` - Cliente HTTP centralizado
- `Script.js` - Lógica geral (header, menu, eventos)
- `carrinho.js` - Gerenciador do carrinho
- `style.css` - Estilos responsivos (1300+ linhas)

### Backend
- `server.ts` - Configuração do Express
- `authController.ts` - Autenticação
- `movieController.ts` - Gerenciamento de filmes
- `cartController.ts` - Gerenciamento do carrinho
- `authMiddleware.ts` - Proteção de rotas
- `init.sql` - Schema + dados iniciais
- `initDb.ts` - Script de inicialização

---

## 📚 Documentação Adicional

Veja na raiz do projeto:
- `COMEÇAR_AGORA.md` - Início rápido
- `EXECUTAR.md` - Guia detalhado de execução
- `STATUS.md` - Status geral do projeto
- `CHECKLIST.md` - Lista de correções realizadas

---

## 🤝 Contribuindo

Este é um projeto educacional. Sinta-se livre para fazer fork, modificar e melhorar!

---

## 📄 Licença

MIT - Veja arquivo LICENSE para mais detalhes

---

## 👤 Autor

Desenvolvido por Wilian

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor (terminal)
2. Abra DevTools (F12) no navegador
3. Teste endpoints com curl
4. Veja a documentação nos arquivos .md

---

## 🎉 Pronto para Começar?

```bash
cd backend
npm install
npm run init-db
npm run dev
```

Então abra: **http://localhost:3000/**

Bom desenvolvimento! 🚀
