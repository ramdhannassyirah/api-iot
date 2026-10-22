
import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../auth/auth.middleware.js';
import * as controller from './mqtt.controller.js';
import {
  createMqttSchema,
  updateMqttSchema,
  mqttIdSchema,
} from './mqtt.schema.js';

const router = Router();

router.use(authenticate);

router.get('/', controller.index);
router.get('/:id', validate(mqttIdSchema), controller.show);
router.post('/', validate(createMqttSchema), controller.create);
router.patch(
  '/:id',
  validate(mqttIdSchema),
  validate(updateMqttSchema),
  controller.update,
);
router.delete('/:id', validate(mqttIdSchema), controller.remove);

export default router;
