import { Request, Response } from 'express';
import db from '../config/database';

export class MovieController {

    index(req: Request, res: Response) {
        try {
            const movies = db.prepare('SELECT * FROM filmes').all();
            return res.json(movies);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    show(req: Request, res: Response) {
        try {
            const movie = db.prepare('SELECT * FROM filmes WHERE id = ?').get(req.params.id);
            if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });
            return res.json(movie);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    create(req: Request, res: Response) {
        try {
            const { titulo, descricao, genero, preco, capa_url, duracao, ano } = req.body;
            if (!titulo || !preco) return res.status(400).json({ error: 'Titulo e Preço obrigatórios' });

            const stmt = db.prepare(`
                INSERT INTO filmes (titulo, descricao, genero, preco, capa_url, duracao, ano)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            const result = stmt.run(titulo, descricao, genero, preco, capa_url, duracao, ano);
            return res.status(201).json({ id: result.lastInsertRowid, message: 'Filme criado!' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    update(req: Request, res: Response) {
        try {
            const { titulo, descricao, genero, preco, capa_url, duracao, ano } = req.body;
            const stmt = db.prepare(`
                UPDATE filmes SET titulo=?, descricao=?, genero=?, preco=?, capa_url=?, duracao=?, ano=?
                WHERE id=?
            `);
            const info = stmt.run(titulo, descricao, genero, preco, capa_url, duracao, ano, req.params.id);
            if (info.changes === 0) return res.status(404).json({ error: 'Filme não encontrado' });
            return res.json({ message: 'Atualizado com sucesso' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    delete(req: Request, res: Response) {
        try {
            const info = db.prepare('DELETE FROM filmes WHERE id = ?').run(req.params.id);
            if (info.changes === 0) return res.status(404).json({ error: 'Filme não encontrado' });
            return res.json({ message: 'Deletado com sucesso' });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Filmes em destaque (primeiros 6)
    featured(req: Request, res: Response) {
        try {
            const movies = db.prepare('SELECT * FROM filmes LIMIT 6').all();
            return res.json(movies);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Próximos lançamentos (últimos 3)
    upcoming(req: Request, res: Response) {
        try {
            const movies = db.prepare('SELECT * FROM filmes ORDER BY ano DESC LIMIT 3').all();
            return res.json(movies);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Buscar filmes por título ou gênero
    search(req: Request, res: Response) {
        try {
            const q = req.query.q as string;
            if (!q || q.trim().length < 3) {
                return res.status(400).json({ error: 'Digite pelo menos 3 caracteres' });
            }

            const searchTerm = `%${q}%`;
            const movies = db.prepare(`
                SELECT * FROM filmes 
                WHERE titulo LIKE ? OR genero LIKE ? OR descricao LIKE ?
                LIMIT 20
            `).all(searchTerm, searchTerm, searchTerm);
            
            return res.json(movies);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Filtrar por gênero
    byCategory(req: Request, res: Response) {
        try {
            const category = req.params.category as string;
            if (!category) {
                return res.status(400).json({ error: 'Categoria obrigatória' });
            }

            const movies = db.prepare(`
                SELECT * FROM filmes 
                WHERE genero LIKE ?
            `).all(`%${category}%`);
            
            return res.json(movies);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}