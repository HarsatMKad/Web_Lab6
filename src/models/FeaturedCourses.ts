import { Schema, model } from "mongoose";

interface IFeaturedCourses {
  _id: string;
  user_id: Schema.Types.ObjectId;
  course_id: Schema.Types.ObjectId;
}
 
const featuredCoursesSchema: Schema = new Schema<IFeaturedCourses>({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  course_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Courses",
  },
});

const FeaturedCourses = model<IFeaturedCourses>("featuredCourses", featuredCoursesSchema);

export default FeaturedCourses;
export { IFeaturedCourses };