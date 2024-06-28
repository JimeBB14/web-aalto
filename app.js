import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import {
  getSignedCookie,
  setSignedCookie,
} from "https://deno.land/x/hono@v3.12.11/helper.ts";
import * as courseController from "./courseController.js";

const app = new Hono();
const secret = "secret";
const sessionData = new Map(); 

app.use('*', async (c, next) => {
  const method = c.req.method.toUpperCase();
  if (method === 'POST') {
    const body = await c.req.parseBody();
    if (body._method) {
      c.req.method = body._method.toUpperCase();
    }
  }
  
  let sessionId = await getSignedCookie(c, secret, "sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    await setSignedCookie(c, "sessionId", sessionId, secret, {
      path: "/",
    });
  }
  c.req.sessionId = sessionId; 
  c.req.session = sessionData.get(sessionId) || {}; 
  await next();
  sessionData.set(sessionId, c.req.session); 
});

app.get("/courses", (c) => courseController.showCourses(c));
app.post("/courses", (c) => courseController.addCourse(c));
app.get("/courses/:courseId", (c) => courseController.showCourse(c));
app.post("/courses/:courseId/delete", (c) => courseController.deleteCourse(c));
app.post("/courses/:courseId/feedbacks/:value", (c) => courseController.addFeedback(c));
app.get("/courses/:courseId/feedbacks/:value", (c) => courseController.getFeedbackCount(c));

export default app;
