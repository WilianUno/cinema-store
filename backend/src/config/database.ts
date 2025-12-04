import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '..', '..', 'database.db');

const db = new Database(dbPath, { 
    verbose: console.log 
});

db.pragma('foreign_keys = ON');

console.log('✅ SQLite database connected:', dbPath);

export default db;