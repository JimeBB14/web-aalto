import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as courseController from "./courseController.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });
const app = new Hono();

app.use('*', async (c, next) => {
  const method = c.req.method.toUpperCase();
  if (method === 'POST') {
    const body = await c.req.parseBody();
    if (body._method) {
      c.req.method = body._method.toUpperCase();
    }
  }
  await next();
});

app.get("/courses", (c) => courseController.showCourses(c));
app.post("/courses", (c) => courseController.addCourse(c));
app.get("/courses/:courseId", (c) => courseController.showCourse(c));
app.post("/courses/:courseId/delete", (c) => courseController.deleteCourse(c));
app.post("/courses/:courseId/feedbacks/:value", (c) => courseController.addFeedback(c));
app.get("/courses/:courseId/feedbacks/:value", (c) => courseController.getFeedbackCount(c));

export default app;