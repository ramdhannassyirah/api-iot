import { Router } from 'express';

const router = Router();

// GET /api/v1/aws -> daftar data terbaru AWS
router.get('/', (req, res) => {
  res.json({ data: [], message: 'Endpoint AWS (belum diimplementasikan)' });
});

// POST /api/v1/aws -> terima kiriman data dari alat AWS
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Endpoint AWS (belum diimplementasikan)' });
});

export default router;
