import { Request, Response } from 'express';
import db from '../config/database';

export class CartController {

    // ADICIONAR AO CARRINHO 
    addToCart(req: Request, res: Response) {
        try {
            // O ID do usuário vem do token (authMiddleware)
            const userId = req.user?.id;
            const { filme_id, quantidade } = req.body;

            if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' });
            if (!filme_id) return res.status(400).json({ error: 'ID do filme é obrigatório' });

            // 1. Verifica se o filme existe
            const movie = db.prepare('SELECT id FROM filmes WHERE id = ?').get(filme_id);
            if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });

            // 2. Verifica se já está no carrinho
            const itemExists = db.prepare('SELECT id, quantidade FROM carrinho WHERE usuario_id = ? AND filme_id = ?')
                .get(userId, filme_id) as { id: number, quantidade: number };

            if (itemExists) {
                // Se já existe, atualizamos a quantidade
                const novaQtd = itemExists.quantidade + (quantidade || 1);
                db.prepare('UPDATE carrinho SET quantidade = ? WHERE id = ?').run(novaQtd, itemExists.id);
                return res.json({ message: 'Quantidade atualizada no carrinho' });
            } else {
                // Se não existe, cria novo item
                db.prepare('INSERT INTO carrinho (usuario_id, filme_id, quantidade) VALUES (?, ?, ?)')
                    .run(userId, filme_id, quantidade || 1);
                return res.status(201).json({ message: 'Filme adicionado ao carrinho' });
            }

        } catch (error: any) {
            return res.status(500).json({ error: 'Erro ao adicionar ao carrinho: ' + error.message });
        }
    }

    // LISTAR MEU CARRINHO 
    getCart(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' });

            // JOIN: Traz os dados do carrinho + dados do filme correspondente
            const query = `
                SELECT 
                    c.id as item_id,
                    c.quantidade,
                    f.id as filme_id,
                    f.titulo,
                    f.preco,
                    f.capa_url
                FROM carrinho c
                INNER JOIN filmes f ON c.filme_id = f.id
                WHERE c.usuario_id = ?
            `;
            
            const cartItems = db.prepare(query).all(userId);
            
            // Calcula o total do carrinho na hora
            const total = cartItems.reduce((acc: number, item: any) => acc + (item.preco * item.quantidade), 0);

            return res.json({
                items: cartItems,
                total: total.toFixed(2) // Formata para 2 casas decimais
            });

        } catch (error: any) {
            return res.status(500).json({ error: 'Erro ao buscar carrinho' });
        }
    }

    //  REMOVER ITEM 
    remove(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            const { id } = req.params; // ID do item do carrinho, não do filme

            // Garante que o usuário só delete o PRÓPRIO item
            const result = db.prepare('DELETE FROM carrinho WHERE id = ? AND usuario_id = ?')
                .run(id, userId);

            if (result.changes === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }

            return res.json({ message: 'Item removido do carrinho' });

        } catch (error: any) {
            return res.status(500).json({ error: 'Erro ao remover item' });
        }
    }

    // ATUALIZAR QUANTIDADE DE ITEM
    update(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            const { itemId, quantity } = req.body;

            if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' });
            if (!itemId || quantity === undefined) {
                return res.status(400).json({ error: 'itemId e quantity obrigatórios' });
            }

            if (quantity < 1) {
                // Se quantidade é menor que 1, remove o item
                db.prepare('DELETE FROM carrinho WHERE id = ? AND usuario_id = ?')
                    .run(itemId, userId);
                return res.json({ message: 'Item removido do carrinho' });
            }

            // Atualiza a quantidade
            const result = db.prepare('UPDATE carrinho SET quantidade = ? WHERE id = ? AND usuario_id = ?')
                .run(quantity, itemId, userId);

            if (result.changes === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }

            return res.json({ message: 'Quantidade atualizada' });

        } catch (error: any) {
            return res.status(500).json({ error: 'Erro ao atualizar carrinho' });
        }
    }

    // LIMPAR CARRINHO
    clear(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' });

            db.prepare('DELETE FROM carrinho WHERE usuario_id = ?').run(userId);
            return res.json({ message: 'Carrinho limpo com sucesso' });

        } catch (error: any) {
            return res.status(500).json({ error: 'Erro ao limpar carrinho' });
        }
    }
}