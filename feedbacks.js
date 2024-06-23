const feedbackCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };
  
  const addFeedback = async (value) => {
    feedbackCounts[value]++;
  };
  
  const getFeedbackCount = async (value) => {
    return feedbackCounts[value];
  };
  
  export { addFeedback, getFeedbackCount };
  