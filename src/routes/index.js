import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import awlrRoutes from './awlr.routes.js';
import awsRoutes from './aws.routes.js';
import arrRoutes from './arr.routes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    name: 'Monitoring API',
    version: 'v1',
  });
});

router.use('/auth', authRoutes);
router.use('/awlr', awlrRoutes);
router.use('/aws', awsRoutes);
router.use('/arr', arrRoutes);

export default router;
