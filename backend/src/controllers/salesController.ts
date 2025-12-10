import { Request, Response } from 'express';
import db from '../config/database';

class SalesController {
  list(req: Request, res: Response) {
    try {
      const vendas = db.prepare(`
        SELECT 
          c.id,
          c.usuario_id,
          u.nome as usuario_nome,
          c.total,
          c.data_compra,
          c.status
        FROM compras c
        LEFT JOIN usuarios u ON c.usuario_id = u.id
        ORDER BY c.data_compra DESC
      `).all();

      return res.json(vendas);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  stats(req: Request, res: Response) {
    try {
      const stats = {
        total: (db.prepare('SELECT SUM(total) as sum FROM compras').get() as { sum: number }).sum || 0,
        pedidos: (db.prepare('SELECT COUNT(*) as count FROM compras').get() as { count: number }).count,
        clientes: (db.prepare('SELECT COUNT(DISTINCT usuario_id) as count FROM compras').get() as { count: number }).count
      };

      return res.json(stats);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new SalesController();
