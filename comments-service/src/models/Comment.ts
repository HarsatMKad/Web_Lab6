import { Schema, model } from 'mongoose';

interface IComment {
	_id: string;
	user: string;
	lesson: string;
	text: string;
}

const LessonSchema: Schema = new Schema<IComment>({
	user: {
		type: String,
		required: true,
	},
	lesson: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
		maxlength: 255,
	},
});

const Comment = model<IComment>('Comments', LessonSchema);

export default Comment;
export { IComment };