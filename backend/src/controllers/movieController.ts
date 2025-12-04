import { Request, Response } from 'express';
import db from '../config/database';
import { Movie } from '../types/types';


export const getAllMovies = async (req: Request, res: Response): Promise<void> => {
    try {
        const { genero, busca } = req.query;

        let query = 'SELECT * FROM filmes WHERE 1=1';
        const params: any[] = [];

        if (genero) {
            query += ' AND genero = ?';
            params.push(genero);
        }

        if (busca) {
            query += ' AND titulo LIKE ?';
            params.push(`%${busca}%`);
        }

        query += ' ORDER BY data_criacao DESC';

        const movies = db.prepare(query).all(...params) as Movie[];

        res.status(200).json(movies);
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        res.status(500).json({ error: 'Erro ao buscar filmes' });
    }
};

export const getMovieById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const movie = db.prepare(`
            SELECT * FROM filmes WHERE id = ?
        `).get(id) as Movie | undefined;

        if (!movie) {
            res.status(404).json({ error: 'Filme não encontrado' });
            return;
        }

        res.status(200).json(movie);
    } catch (error) {
        console.error('Erro ao buscar filme:', error);
        res.status(500).json({ error: 'Erro ao buscar filme' });
    }
};

export const createMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const { titulo, descricao, genero, preco, capa_url, duracao, ano } = req.body;

        if (!titulo || !preco) {
            res.status(400).json({ error: 'Título e preço são obrigatórios' });
            return;
        }

        if (preco <= 0) {
            res.status(400).json({ error: 'Preço deve ser maior que zero' });
            return;
        }

        const result = db.prepare(`
            INSERT INTO filmes (titulo, descricao, genero, preco, capa_url, duracao, ano)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(titulo, descricao || null, genero || null, preco, capa_url || null, duracao || null, ano || null);

        const newMovie = db.prepare(`
            SELECT * FROM filmes WHERE id = ?
        `).get(result.lastInsertRowid) as Movie;

        res.status(201).json({
            message: 'Filme criado com sucesso',
            movie: newMovie
        });
    } catch (error) {
        console.error('Erro ao criar filme:', error);
        res.status(500).json({ error: 'Erro ao criar filme' });
    }
};

export const updateMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { titulo, descricao, genero, preco, capa_url, duracao, ano } = req.body;

        const existingMovie = db.prepare('SELECT id FROM filmes WHERE id = ?').get(id);

        if (!existingMovie) {
            res.status(404).json({ error: 'Filme não encontrado' });
            return;
        }

        if (preco !== undefined && preco <= 0) {
            res.status(400).json({ error: 'Preço deve ser maior que zero' });
            return;
        }

        const updates: string[] = [];
        const params: any[] = [];

        if (titulo !== undefined) {
            updates.push('titulo = ?');
            params.push(titulo);
        }
        if (descricao !== undefined) {
            updates.push('descricao = ?');
            params.push(descricao);
        }
        if (genero !== undefined) {
            updates.push('genero = ?');
            params.push(genero);
        }
        if (preco !== undefined) {
            updates.push('preco = ?');
            params.push(preco);
        }
        if (capa_url !== undefined) {
            updates.push('capa_url = ?');
            params.push(capa_url);
        }
        if (duracao !== undefined) {
            updates.push('duracao = ?');
            params.push(duracao);
        }
        if (ano !== undefined) {
            updates.push('ano = ?');
            params.push(ano);
        }

        if (updates.length === 0) {
            res.status(400).json({ error: 'Nenhum campo para atualizar' });
            return;
        }

        params.push(id);

        db.prepare(`
            UPDATE filmes SET ${updates.join(', ')} WHERE id = ?
        `).run(...params);

        const updatedMovie = db.prepare(`
            SELECT * FROM filmes WHERE id = ?
        `).get(id) as Movie;

        res.status(200).json({
            message: 'Filme atualizado com sucesso',
            movie: updatedMovie
        });
    } catch (error) {
        console.error('Erro ao atualizar filme:', error);
        res.status(500).json({ error: 'Erro ao atualizar filme' });
    }
};

export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const existingMovie = db.prepare('SELECT id FROM filmes WHERE id = ?').get(id);

        if (!existingMovie) {
            res.status(404).json({ error: 'Filme não encontrado' });
            return;
        }

        db.prepare('DELETE FROM filmes WHERE id = ?').run(id);

        res.status(200).json({ message: 'Filme deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar filme:', error);
        res.status(500).json({ error: 'Erro ao deletar filme' });
    }
};


export const getGenres = async (req: Request, res: Response): Promise<void> => {
    try {
        const genres = db.prepare(`
            SELECT DISTINCT genero 
            FROM filmes 
            WHERE genero IS NOT NULL 
            ORDER BY genero
        `).all() as { genero: string }[];

        const genresList = genres.map(g => g.genero);

        res.status(200).json(genresList);
    } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
        res.status(500).json({ error: 'Erro ao buscar gêneros' });
    }
};