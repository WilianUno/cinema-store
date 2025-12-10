-- Habilitar suporte a foreign keys
PRAGMA foreign_keys = ON;

-- Limpar tabelas existentes
DROP TABLE IF EXISTS itens_compra;
DROP TABLE IF EXISTS compras;
DROP TABLE IF EXISTS carrinho;
DROP TABLE IF EXISTS filmes;
DROP TABLE IF EXISTS usuarios;

-- ==========================================
-- TABELA DE USUÁRIOS
-- ==========================================
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    nome TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABELA DE FILMES
-- ==========================================
CREATE TABLE filmes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    genero TEXT,
    preco REAL NOT NULL,
    capa_url TEXT,
    duracao INTEGER,
    ano INTEGER,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABELA DE CARRINHO
-- ==========================================
CREATE TABLE carrinho (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    filme_id INTEGER NOT NULL,
    quantidade INTEGER DEFAULT 1,
    data_adicao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, filme_id)
);

-- ==========================================
-- TABELA DE COMPRAS
-- ==========================================
CREATE TABLE compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    total REAL NOT NULL,
    data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'completed' CHECK(status IN ('pending', 'completed', 'cancelled')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ==========================================
-- TABELA DE ITENS DA COMPRA
-- ==========================================
CREATE TABLE itens_compra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    compra_id INTEGER NOT NULL,
    filme_id INTEGER,
    preco REAL NOT NULL,
    quantidade INTEGER DEFAULT 1,
    FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE SET NULL
);

-- ==========================================
-- ÍNDICES PARA PERFORMANCE
-- ==========================================
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_filmes_genero ON filmes(genero);
CREATE INDEX idx_filmes_titulo ON filmes(titulo);
CREATE INDEX idx_carrinho_usuario ON carrinho(usuario_id);
CREATE INDEX idx_compras_usuario ON compras(usuario_id);
CREATE INDEX idx_itens_compra_compra ON itens_compra(compra_id);

-- ==========================================
-- SEEDS - DADOS INICIAIS
-- ==========================================

-- Usuário Admin (senha: admin123)
INSERT INTO usuarios (email, senha, nome, role) VALUES
('admin@cinemastore.com', '$2a$10$rKvKzX5JZhGxWn5hC8yYJOqF7V8YqXx5kZ3jH8mP9nL4rQ6tS7vWe', 'Administrador', 'admin');

-- Usuário Comum (senha: user123)
INSERT INTO usuarios (email, senha, nome, role) VALUES
('usuario@cinemastore.com', '$2a$10$kL9mN4oP5qR6sT7uV8wX9yZ0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT', 'Usuário Teste', 'user');

-- Filmes de exemplo
INSERT INTO filmes (titulo, descricao, genero, preco, capa_url, duracao, ano) VALUES
('Matrix', 'Um hacker descobre a verdade sobre sua realidade e seu papel na guerra contra seus controladores.', 'Ficção Científica', 29.90, 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 136, 1999),
('O Senhor dos Anéis: A Sociedade do Anel', 'Um hobbit recebe a tarefa de destruir um anel poderoso.', 'Fantasia', 34.90, 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', 178, 2001),
('Interestelar', 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço.', 'Ficção Científica', 32.90, 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 169, 2014),
('Pulp Fiction', 'As vidas de dois assassinos da máfia se entrelaçam com outros criminosos.', 'Crime', 27.90, 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 154, 1994),
('Clube da Luta', 'Um homem insone e um vendedor de sabão formam um clube de luta subterrâneo.', 'Drama', 28.90, 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 139, 1999),
('A Origem', 'Um ladrão que rouba segredos corporativos através de tecnologia de compartilhamento de sonhos.', 'Ficção Científica', 31.90, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 148, 2010),
('Gladiador', 'Um general romano se torna gladiador para vingar sua família.', 'Ação', 26.90, 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', 155, 2000),
('Os Suspeitos', 'Um pequeno criminoso conta uma história após um massacre em um navio.', 'Crime', 25.90, 'https://image.tmdb.org/t/p/w500/n3h4wagEu93pCl1VriBdjWABb3N.jpg', 106, 1995),
('Cidade de Deus', 'A história de crescimento da criminalidade organizada nas favelas do Rio.', 'Crime', 24.90, 'https://image.tmdb.org/t/p/w500/k7eYdCxiETcn3vB3wWs5XVIqEwN.jpg', 130, 2002),
('O Poderoso Chefão', 'O patriarca idoso de uma dinastia do crime organizado transfere o controle.', 'Crime', 35.90, 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 175, 1972),
('Forrest Gump', 'As presidências de Kennedy e Johnson através da perspectiva de um homem simples.', 'Drama', 29.90, 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', 142, 1994),
('Parasita', 'Uma família pobre se infiltra em uma casa rica com consequências inesperadas.', 'Suspense', 33.90, 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', 132, 2019),
('Coringa', 'Um comediante falido é transformado em um assassino psicopata.', 'Drama', 30.90, 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', 122, 2019),
('Vingadores: Ultimato', 'Os Vingadores restantes devem encontrar uma maneira de reverter as ações de Thanos.', 'Ação', 36.90, 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', 181, 2019),
('Um Sonho de Liberdade', 'Dois homens presos formam uma amizade ao longo de vários anos.', 'Drama', 27.90, 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 142, 1994);