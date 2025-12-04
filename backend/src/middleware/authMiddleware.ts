import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                role: string;
            };
        }
    }
}

export const authMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            res.status(401).json({ error: 'Token não fornecido' });
            return;
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'Token inválido' });
            return;
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            res.status(401).json({ error: 'Token expirado ou inválido' });
            return;
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Erro na autenticação' });
    }
};

export const adminMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
    }

    if (req.user.role !== 'admin') {
        res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
        return;
    }

    next();
};