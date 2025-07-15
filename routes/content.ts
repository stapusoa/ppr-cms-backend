import express from 'express';
import * as contentController from '../controllers/contentController';

const router = express.Router();

router.get('/', contentController.getAllContent);
router.post('/', contentController.createContent);
router.put('/:path', contentController.updateContent);
router.delete('/:path', contentController.deleteContent);

export const contentRoutes = router;