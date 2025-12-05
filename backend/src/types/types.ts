export interface User {
    id: number;
    email: string;
    senha?: string; // opcional pois às vezes buscamos sem senha
    nome: string;
    role: 'user' | 'admin';
    data_criacao?: string;
}

export interface UserResponse {
    id: number;
    email: string;
    nome: string;
    role: 'user' | 'admin';
}

export interface TokenPayload {
    id: number;
    email: string;
    role: 'user' | 'admin';
}

export interface Movie {
    id: number;
    titulo: string;
    descricao: string;
    genero: string;
    preco: number;
    capa_url: string;
    duracao: number;
    ano: number;
    data_criacao: string;
}

export interface MovieCreate {
    titulo: string;
    descricao?: string;
    genero?: string;
    preco: number;
    capa_url?: string;
    duracao?: number;
    ano?: number;
}

export interface CartItem {
    id: number;
    usuario_id: number;
    filme_id: number;
    quantidade: number;
    data_adicao: string;
}

export interface CartItemWithMovie extends CartItem {
    filme: Movie;
}

export interface Purchase {
    id: number;
    usuario_id: number;
    total: number;
    data_compra: string;
    status: 'pending' | 'completed' | 'cancelled';
}

export interface PurchaseItem {
    id: number;
    compra_id: number;
    filme_id: number | null;
    preco: number;
    quantidade: number;
}