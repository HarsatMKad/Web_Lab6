import { Schema, model } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';

interface IEnrollment {
	_id: string;
	user: Schema.Types.ObjectId | IUser;
	course: Schema.Types.ObjectId | ICourse;
	lessonsCompleted: Schema.Types.ObjectId[];
	enrollmentDate: number;
	progress: number;
}

const EnrollmentSchema: Schema = new Schema<IEnrollment>({
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Users',
	},
	course: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Courses',
	},
	lessonsCompleted: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Lessons',
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
