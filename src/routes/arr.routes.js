import { Router } from 'express';

const router = Router();

// GET /api/v1/arr -> daftar data terbaru ARR
router.get('/', (req, res) => {
  res.json({ data: [], message: 'Endpoint ARR (belum diimplementasikan)' });
});

// POST /api/v1/arr -> terima kiriman data dari alat ARR
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Endpoint ARR (belum diimplementasikan)' });
});

export default router;
