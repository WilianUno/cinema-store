import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(__dirname, '..', '..', 'database.db');
const initPath = path.join(__dirname, '..', '..', 'init.sql');

const db = new Database(dbPath, { 
    verbose: console.log 
});

db.pragma('foreign_keys = ON');

try {
    const checkTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'").get();
    
    if (!checkTable) {
        console.log('🔄 Inicializando banco de dados com init.sql...');
        const initSql = fs.readFileSync(initPath, 'utf-8');
        db.exec(initSql);
        console.log(' Tabelas criadas com sucesso!');
    }
} catch (error) {
    console.error(' Erro ao inicializar o banco:', error);
}
// ----------------------------------------------------------

console.log(' SQLite database connected:', dbPath);

export default db;