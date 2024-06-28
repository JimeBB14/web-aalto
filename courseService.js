const kv = await Deno.openKv();

let courses = [];

const getCourses = async () => {
  return courses;
};

const addCourse = async (course) => {
  courses.push(course);
  console.log("addCourse - current courses:", courses);
};

const getCourse = async (id) => {
  return courses.find(course => course.id === id);
};

const deleteCourse = async (id) => {
  courses = courses.filter(course => course.id !== id);
  console.log("deleteCourse - current courses:", courses);
};

const addFeedback = async (courseId, value) => {
  const key = ["feedback", courseId, value.toString()];
  const entry = await kv.get(key);
  const currentCount = entry.value || 0;
  await kv.set(key, currentCount + 1);
};

const getFeedbackCount = async (courseId, value) => {
  const key = ["feedback", courseId, value.toString()];
  const entry = await kv.get(key);
  return entry.value || 0;
};

export { getCourses, addCourse, getCourse, deleteCourse, addFeedback, getFeedbackCount };