import * as courseService from "./courseService.js";
import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showCourses = async (c) => {
  const courses = await courseService.getCourses();
  return c.html(await eta.render("courses.eta", { courses, errors: [], formData: {} }));
};

const addCourse = async (c) => {
  const body = await c.req.parseBody();
  const { name } = body;
  const errors = [];

  if (typeof name !== 'string' || name.length < 4) {
    errors.push("The course name should be a string of at least 4 characters.");
  }

  if (errors.length > 0) {
    const courses = await courseService.getCourses();
    return c.html(await eta.render("courses.eta", { courses, errors, formData: body }));
  }

  const id = crypto.randomUUID();
  await courseService.addCourse({ id, name });
  return c.redirect("/courses");
};

const showCourse = async (c) => {
  const { courseId } = c.req.param();
  const course = await courseService.getCourse(courseId);
  if (!course) {
    return c.text('Course not found', 404);
  }
  
  const session = c.req.session;
  const feedbackGiven = session[`feedback_${courseId}`];

  if (feedbackGiven) {
    return c.html(await eta.render("course.eta", { course, feedbackGiven: true }));
  }

  return c.html(await eta.render("course.eta", { course, feedbackGiven: false }));
};

const deleteCourse = async (c) => {
  const { courseId } = c.req.param();
  await courseService.deleteCourse(courseId);
  return c.redirect("/courses");
};

const addFeedback = async (c) => {
  const { courseId, value } = c.req.param();
  const session = c.req.session;

  if (session[`feedback_${courseId}`]) {
    return c.redirect(`/courses/${courseId}`);
  }

  await courseService.addFeedback(courseId, value);
  session[`feedback_${courseId}`] = true;
  return c.redirect(`/courses/${courseId}`);
};

const getFeedbackCount = async (c) => {
  const { courseId, value } = c.req.param();
  const count = await courseService.getFeedbackCount(courseId, value);
  return c.text(`Feedback ${value}: ${count}`);
};

export { showCourses, addCourse, showCourse, deleteCourse, addFeedback, getFeedbackCount };
