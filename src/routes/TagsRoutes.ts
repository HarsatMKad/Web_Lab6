import express from 'express';
import { getTags, createTags, deleteTags } from '../controllers/TagsController';

const router = express.Router();

router.get('/', getTags);
router.post('/', createTags);
router.delete('/:id', deleteTags);

export default router;
