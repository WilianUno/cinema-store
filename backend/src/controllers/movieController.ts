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
}