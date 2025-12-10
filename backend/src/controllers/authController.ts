import { Request, Response } from 'express';
import db from '../config/database';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { generateToken } from '../utils/jwt';
import { User, UserResponse } from '../types/types';

export class AuthController {

    // Login
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });

            const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email) as User;
            if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

            const isValid = await comparePassword(password, user.senha || '');
            if (!isValid) return res.status(401).json({ error: 'Credenciais inválidas' });

            const token = generateToken({ id: user.id, email: user.email, role: user.role });

            const userResponse: UserResponse = { id: user.id, email: user.email, nome: user.nome, role: user.role };
            return res.json({ message: 'Login sucesso', token, user: userResponse });

        } catch (error: any) {
            return res.status(500).json({ error: 'Erro no login' });
        }
    }

    // Registro
    async register(req: Request, res: Response) {
        try {
            const { email, password, nome } = req.body;
            if (!email || !password || !nome) return res.status(400).json({ error: 'Dados incompletos' });

            const exists = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
            if (exists) return res.status(400).json({ error: 'Email já existe' });

            const hashed = await hashPassword(password);
            const result = db.prepare('INSERT INTO usuarios (email, senha, nome, role) VALUES (?, ?, ?, ?)')
                             .run(email, hashed, nome, 'user');

            const newUser: UserResponse = { id: Number(result.lastInsertRowid), email, nome, role: 'user' };
            const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

            return res.status(201).json({ message: 'Criado com sucesso', token, user: newUser });

        } catch (error: any) {
            return res.status(500).json({ error: 'Erro ao registrar' });
        }
    }

    // Perfil (A função que estava faltando)
    async getProfile(req: Request, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ error: 'Não autenticado' });
            
            const user = db.prepare('SELECT id, email, nome, role FROM usuarios WHERE id = ?').get(req.user.id);
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

            return res.json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar perfil' });
        }
    }
}