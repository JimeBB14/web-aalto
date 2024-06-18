const getFeedbackCount = async (value) => {
    const kv = await Deno.openKv();
    const feedback = await kv.get(["feedback", value]);
    return feedback.value ?? 0;
  };
  
  const incrementFeedbackCount = async (value) => {
    const kv = await Deno.openKv();
    const currentCount = await getFeedbackCount(value);
    await kv.set(["feedback", value], currentCount + 1);
  };
  
  export { getFeedbackCount, incrementFeedbackCount };