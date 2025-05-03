import express from 'express';
import { getTags, createTags, deleteTags } from '../controllers/TagsController';

const tagRouter = express.Router();

tagRouter.get('/', getTags);
tagRouter.post('/', createTags);
tagRouter.delete('/:id', deleteTags);

export default tagRouter;