import express from 'express';
import {
	getFeaturedCourses,
	createFeaturedCourses,
	deleteFeaturedCourses,
} from '../controllers/FeaturedCoursesController';

const router = express.Router();

router.get('/', getFeaturedCourses);
router.post('/:course_id', createFeaturedCourses);
router.delete('/:course_id', deleteFeaturedCourses);

export default router;
