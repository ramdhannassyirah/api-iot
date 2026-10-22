import { Router } from 'express';

const router = Router();

// GET /api/v1/awlr -> daftar data terbaru AWLR
router.get('/', (req, res) => {
  res.json({ data: [], message: 'Endpoint AWLR (belum diimplementasikan)' });
});

// POST /api/v1/awlr -> terima kiriman data dari alat AWLR
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Endpoint AWLR (belum diimplementasikan)' });
});

export default router;
