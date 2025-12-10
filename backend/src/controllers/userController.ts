import { Request, Response } from 'express';
import db from '../config/database';

class UserController {
  list(req: Request, res: Response) {
    try {
      const users = db.prepare(`
        SELECT id, nome, email, role, data_criacao FROM usuarios
      `).all();
      
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: 'ID obrigatório' });
      }

      const result = db.prepare('DELETE FROM usuarios WHERE id = ?').run(id);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  stats(req: Request, res: Response) {
    try {
      const totalUsers = (db.prepare('SELECT COUNT(*) as count FROM usuarios').get() as { count: number }).count;
      const totalOrders = (db.prepare('SELECT COUNT(*) as count FROM compras').get() as { count: number }).count;
      const totalSales = (db.prepare('SELECT SUM(total) as total FROM compras').get() as { total: number }).total || 0;

      return res.json({
        totalUsers,
        totalOrders,
        totalSales
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new UserController();
