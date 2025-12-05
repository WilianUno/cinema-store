import { Request, Response } from 'express';
import db from '../config/database';

export class CheckoutController {

    constructor() {
        // --- AUTO-MIGRATION (Truque para criar as tabelas sem você precisar rodar scripts manuais) ---
        db.prepare(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                total REAL NOT NULL,
                data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
            )
        `).run();

        db.prepare(`
            CREATE TABLE IF NOT EXISTS itens_pedido (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pedido_id INTEGER NOT NULL,
                filme_id INTEGER NOT NULL,
                quantidade INTEGER NOT NULL,
                preco_unitario REAL NOT NULL,
                FOREIGN KEY(pedido_id) REFERENCES pedidos(id),
                FOREIGN KEY(filme_id) REFERENCES filmes(id)
            )
        `).run();
    }

    checkout(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Usuário não logado' });

            // 1. Busca o que tem no carrinho AGORA
            const cartItems = db.prepare(`
                SELECT c.quantidade, f.id as filme_id, f.preco 
                FROM carrinho c
                JOIN filmes f ON c.filme_id = f.id
                WHERE c.usuario_id = ?
            `).all(userId) as { quantidade: number, filme_id: number, preco: number }[];

            if (cartItems.length === 0) {
                return res.status(400).json({ error: 'Seu carrinho está vazio' });
            }

            // 2. Calcula o total
            const total = cartItems.reduce((acc, item) => acc + (item.quantidade * item.preco), 0);

            // 3. INÍCIO DA TRANSAÇÃO (Tudo ou Nada)
            const realizarCompra = db.transaction(() => {
                // A. Cria o registro do Pedido (Cabeçalho)
                const resultPedido = db.prepare('INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)')
                    .run(userId, total);
                const pedidoId = resultPedido.lastInsertRowid;

                // B. Move os itens do Carrinho para o Histórico (Itens do Pedido)
                const insertItem = db.prepare('INSERT INTO itens_pedido (pedido_id, filme_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)');
                
                for (const item of cartItems) {
                    insertItem.run(pedidoId, item.filme_id, item.quantidade, item.preco);
                }

                // C. Esvazia o Carrinho
                db.prepare('DELETE FROM carrinho WHERE usuario_id = ?').run(userId);

                return pedidoId;
            });

            // Executa a transação
            const pedidoId = realizarCompra();

            return res.status(201).json({ 
                message: 'Compra realizada com sucesso!', 
                pedido_id: pedidoId,
                total_pago: Number(total.toFixed(2)) 
            });

        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao processar compra' });
        }
    }

    // Listar minhas compras passadas
    getMyOrders(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            const orders = db.prepare('SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY data_compra DESC').all(userId);
            return res.json(orders);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar pedidos' });
        }
    }
}