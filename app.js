import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as feedbackService from "./feedbacks.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });
const app = new Hono();

const showFeedbackForm = async (c) => {
  return c.html(await eta.render("index.eta", {}));
};

const addFeedback = async (c) => {
  const { value } = c.req.param();
  await feedbackService.addFeedback(value);
  return c.redirect("/");
};

const getFeedbackCount = async (c) => {
  const { value } = c.req.param();
  const count = await feedbackService.getFeedbackCount(value);
  return c.text(`Feedback ${value}: ${count}`);
};

app.get("/", (c) => showFeedbackForm(c));
app.post("/feedbacks/:value", (c) => addFeedback(c));
app.get("/feedbacks/:value", (c) => getFeedbackCount(c));

export default app;
