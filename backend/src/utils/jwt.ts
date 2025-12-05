import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/types';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign({ ...payload }, JWT_SECRET, { 
        expiresIn: JWT_EXPIRES_IN 
    } as jwt.SignOptions); 
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
};