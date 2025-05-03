import { Schema, model } from 'mongoose';

interface IEnrollment {
	_id: string;
	user: string;
	course: string;
	lessonsCompleted: string[];
	enrollmentDate: number;
	progress: number;
}

const EnrollmentSchema: Schema = new Schema<IEnrollment>({
	user: {
		type: String,
		required: true,
	},
	course: {
		type: String,
		required: true,
	},
	lessonsCompleted: [
		{
			type: String,
			default: [],
		},
	],
	enrollmentDate: {
		type: Number,
		required: true,
		default: Date.now,
	},
	progress: {
		type: Number,
		required: true,
		default: 0,
	},
});

const Enrollment = model<IEnrollment>('Enrollments', EnrollmentSchema);

export default Enrollment;
export { IEnrollment };