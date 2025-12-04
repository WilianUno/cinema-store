// backend/scripts/initDb.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

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

    // Ler SQL
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Conectar ao banco (cria se não existir)
    const db = new Database(dbPath);

    console.log(`📂 Banco de dados: ${dbPath}`);
    console.log(`📄 Script SQL: ${sqlPath}\n`);

    // Executar SQL
    db.exec(sql);

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