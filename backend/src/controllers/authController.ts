import { Request, Response } from 'express';
import db from '../config/database';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { generateToken } from '../utils/jwt';
import { User } from '../types/types';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, senha, nome } = req.body;

        // Validações
        if (!email || !senha || !nome) {
            res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
            return;
        }

        if (senha.length < 6) {
            res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
            return;
        }

        const existingUser = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);

        if (existingUser) {
            res.status(400).json({ error: 'Email já cadastrado' });
            return;
        }

        const hashedPassword = await hashPassword(senha);

        const result = db.prepare(`
            INSERT INTO usuarios (email, senha, nome, role)
            VALUES (?, ?, ?, 'user')
        `).run(email, hashedPassword, nome);

        const newUser = db.prepare(`
            SELECT id, email, nome, role, data_criacao 
            FROM usuarios 
            WHERE id = ?
        `).get(result.lastInsertRowid) as User;

        const token = generateToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role
        });

        res.status(201).json({
            message: 'Usuário registrado com sucesso',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                nome: newUser.nome,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            res.status(400).json({ error: 'Email e senha são obrigatórios' });
            return;
        }

        const user = db.prepare(`
            SELECT * FROM usuarios WHERE email = ?
        `).get(email) as User | undefined;

        if (!user) {
            res.status(401).json({ error: 'Email ou senha inválidos' });
            return;
        }

        const isPasswordValid = await comparePassword(senha, user.senha);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Email ou senha inválidos' });
            return;
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                email: user.email,
                nome: user.nome,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};


export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Usuário não autenticado' });
            return;
        }

        const user = db.prepare(`
            SELECT id, email, nome, role, data_criacao 
            FROM usuarios 
            WHERE id = ?
        `).get(req.user.id) as User | undefined;

        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
};