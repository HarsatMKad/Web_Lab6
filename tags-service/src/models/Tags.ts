import { Schema, model } from 'mongoose';

interface ITags {
	_id: string;
	name: string;
	slug: string;
	description: string;
	createdAt: number;
}

const CourseSchema: Schema = new Schema<ITags>({
	name: {
		type: String,
		required: true,
	},
	slug: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Number,
		required: true,
		default: Date.now,
	},
});

const Tag = model<ITags>('Tags', CourseSchema);

export default Tag;
export { ITags };