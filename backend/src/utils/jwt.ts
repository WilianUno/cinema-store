import jwt from 'jsonwebtoken';

const JWT_SECRET = (process.env.JWT_SECRET || 'sua_chave_secreta_aqui') as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

interface TokenPayload {
    id: number;
    email: string;
    role: string;
}

export const generateToken = (payload: TokenPayload): string => {
    const options: any = { expiresIn: JWT_EXPIRES_IN };
    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
};