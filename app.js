import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { getFeedbackCount, incrementFeedbackCount } from "./feedbacks.js";

const app = new Hono();

app.get("/feedbacks/:value", async (c) => {
  const value = c.req.param("value");
  const count = await getFeedbackCount(value);
  return c.text(`Feedback ${value}: ${count}`);
});

app.post("/feedbacks/:value", async (c) => {
  const value = c.req.param("value");
  await incrementFeedbackCount(value);
  const count = await getFeedbackCount(value);
  return c.text(`Feedback ${value}: ${count}`);
});

export default app;