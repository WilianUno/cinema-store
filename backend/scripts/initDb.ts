// backend/scripts/initDb.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcryptjs from 'bcryptjs';

const dbPath = path.join(__dirname, '..', 'database.db');
const sqlPath = path.join(__dirname, '..', 'init.sql');

console.log('🔧 Inicializando banco de dados...\n');

try {
    // Verificar se init.sql existe
    if (!fs.existsSync(sqlPath)) {
        console.error(`❌ Arquivo init.sql não encontrado em: ${sqlPath}`);
        console.log('\n💡 Crie o arquivo init.sql na raiz do backend com o schema SQL');
        process.exit(1);
    }

    // Ler SQL (apenas schema, sem INSERT dos usuários)
    let sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Remover a parte de INSERT de usuários do SQL (vamos fazer manualmente)
    sql = sql.split('-- Usuário Admin')[0].trim();

    // Conectar ao banco (cria se não existir)
    const db = new Database(dbPath);
    db.pragma('foreign_keys = ON');

    console.log(`📂 Banco de dados: ${dbPath}`);
    console.log(`📄 Script SQL: ${sqlPath}\n`);

    // Executar SQL do schema
    db.exec(sql);

    // Agora criar os usuários com senhas hashadas corretamente
    console.log('🔐 Criando usuários com senhas hashadas...\n');

    const adminPassword = bcryptjs.hashSync('admin123', 10);
    const userPassword = bcryptjs.hashSync('user123', 10);

    // Inserir usuários
    db.prepare(`
        INSERT INTO usuarios (email, senha, nome, role) 
        VALUES (?, ?, ?, ?)
    `).run('admin@cinemastore.com', adminPassword, 'Administrador', 'admin');

    db.prepare(`
        INSERT INTO usuarios (email, senha, nome, role) 
        VALUES (?, ?, ?, ?)
    `).run('usuario@cinemastore.com', userPassword, 'Usuário Teste', 'user');

    // Inserir filmes
    const filmes = [
        ['Matrix', 'Um hacker descobre a verdade sobre sua realidade e seu papel na guerra contra seus controladores.', 'Ficção Científica', 29.90, 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 136, 1999],
        ['O Senhor dos Anéis: A Sociedade do Anel', 'Um hobbit recebe a tarefa de destruir um anel poderoso.', 'Fantasia', 34.90, 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', 178, 2001],
        ['Interestelar', 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço.', 'Ficção Científica', 32.90, 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 169, 2014],
        ['Pulp Fiction', 'As vidas de dois assassinos da máfia se entrelaçam com outros criminosos.', 'Crime', 27.90, 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 154, 1994],
        ['Clube da Luta', 'Um homem insone e um vendedor de sabão formam um clube de luta subterrâneo.', 'Drama', 28.90, 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 139, 1999],
        ['A Origem', 'Um ladrão que rouba segredos corporativos através de tecnologia de compartilhamento de sonhos.', 'Ficção Científica', 31.90, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 148, 2010],
        ['Gladiador', 'Um general romano se torna gladiador para vingar sua família.', 'Ação', 26.90, 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', 155, 2000],
        ['Os Suspeitos', 'Um pequeno criminoso conta uma história após um massacre em um navio.', 'Crime', 25.90, 'https://image.tmdb.org/t/p/w500/n3h4wagEu93pCl1VriBdjWABb3N.jpg', 106, 1995],
        ['Cidade de Deus', 'A história de crescimento da criminalidade organizada nas favelas do Rio.', 'Crime', 24.90, 'https://image.tmdb.org/t/p/w500/k7eYdCxiETcn3vB3wWs5XVIqEwN.jpg', 130, 2002],
        ['O Poderoso Chefão', 'O patriarca idoso de uma dinastia do crime organizado transfere o controle.', 'Crime', 35.90, 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 175, 1972],
        ['Forrest Gump', 'As presidências de Kennedy e Johnson através da perspectiva de um homem simples.', 'Drama', 29.90, 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', 142, 1994],
        ['Parasita', 'Uma família pobre se infiltra em uma casa rica com consequências inesperadas.', 'Suspense', 33.90, 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', 132, 2019],
        ['Coringa', 'Um comediante falido é transformado em um assassino psicopata.', 'Drama', 30.90, 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', 122, 2019],
        ['Vingadores: Ultimato', 'Os Vingadores restantes devem encontrar uma maneira de reverter as ações de Thanos.', 'Ação', 36.90, 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', 181, 2019],
        ['Um Sonho de Liberdade', 'Dois homens presos formam uma amizade ao longo de vários anos.', 'Drama', 27.90, 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 142, 1994]
    ];

    const filmStmt = db.prepare(`
        INSERT INTO filmes (titulo, descricao, genero, preco, capa_url, duracao, ano) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    filmes.forEach(filme => {
        filmStmt.run(...filme);
    });

    // Verificar dados criados
    const userCount = db.prepare('SELECT COUNT(*) as count FROM usuarios').get() as { count: number };
    const movieCount = db.prepare('SELECT COUNT(*) as count FROM filmes').get() as { count: number };

    console.log('✅ Banco de dados inicializado com sucesso!');
    console.log(`👥 Usuários criados: ${userCount.count}`);
    console.log(`🎬 Filmes criados: ${movieCount.count}\n`);

    console.log('🔐 Credenciais de acesso:');
    console.log('   Admin: admin@cinemastore.com / admin123');
    console.log('   User:  usuario@cinemastore.com / user123\n');

    db.close();
} catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    process.exit(1);
}
