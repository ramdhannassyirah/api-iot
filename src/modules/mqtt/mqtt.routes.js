
import { Router } from 'express';
import { validate, validateParams } from '../../middlewares/validate.js';
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
router.get('/:id', validateParams(mqttIdSchema), controller.show);
router.post('/', validate(createMqttSchema), controller.create);
router.patch(
  '/:id',
  validateParams(mqttIdSchema),
  validate(updateMqttSchema),
  controller.update,
);
router.delete('/:id', validateParams(mqttIdSchema), controller.remove);

router.get('/:id/status', validateParams(mqttIdSchema), controller.status);
router.post('/:id/publish', validateParams(mqttIdSchema), controller.publish);

export default router;
