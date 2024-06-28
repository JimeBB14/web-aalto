import * as courseService from "./courseService.js";
import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showCourses = async (c) => {
  const courses = await courseService.getCourses();
  console.log("showCourses - courses:", courses);
  return c.html(await eta.render("courses.eta", { courses }));
};

const addCourse = async (c) => {
  const body = await c.req.parseBody();
  const { name } = body;
  const id = crypto.randomUUID();
  await courseService.addCourse({ id, name });
  console.log("addCourse - Added course:", { id, name });
  return c.redirect("/courses");
};

const showCourse = async (c) => {
  const { courseId } = c.req.param();
  const course = await courseService.getCourse(courseId);
  if (!course) {
    return c.text('Course not found', 404);
  }
  console.log("showCourse - course:", course);
  return c.html(await eta.render("course.eta", { course }));
};

const deleteCourse = async (c) => {
  const { courseId } = c.req.param();
  await courseService.deleteCourse(courseId);
  console.log("deleteCourse - Deleted course:", courseId);
  return c.redirect("/courses");
};

const addFeedback = async (c) => {
  const { courseId, value } = c.req.param();
  await courseService.addFeedback(courseId, value);
  return c.redirect(`/courses/${courseId}`);
};

const getFeedbackCount = async (c) => {
  const { courseId, value } = c.req.param();
  const count = await courseService.getFeedbackCount(courseId, value);
  return c.text(`Feedback ${value}: ${count}`);
};

export { showCourses, addCourse, showCourse, deleteCourse, addFeedback, getFeedbackCount };