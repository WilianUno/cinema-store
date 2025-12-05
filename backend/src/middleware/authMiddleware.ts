import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { TokenPayload } from '../types/types'; // Importando o tipo centralizado

// Estendendo o tipo Request para incluir o user tipado corretamente
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload; 
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

        // Separa "Bearer <token>"
        const parts = authHeader.split(' ');
        
        if (parts.length !== 2) {
            res.status(401).json({ error: 'Erro no formato do token' });
            return;
        }

        const [scheme, token] = parts;

        // Verifica se começa com Bearer
        if (!/^Bearer$/i.test(scheme)) {
            res.status(401).json({ error: 'Token malformatado' });
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
    // Primeiro garante que o usuário está logado
    if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
    }

    // Depois verifica se é admin
    if (req.user.role !== 'admin') {
        res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
        return;
    }

    next();
};