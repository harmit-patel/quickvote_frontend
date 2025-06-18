export const validateSurvey = (
    title,
    adminEmail,
    questions,
    endTime,
    errorMessages = {
      title: "Survey title is required.",
      adminEmail: "Admin email is required.",
      questionText: "All questions must have text.",
      minOptions: "Each question must have at least two options.",
      emptyOption: "No option can be empty.",
      endTime: "End time is required.",
    }
  ) => {
    if (!title.trim()) return errorMessages.title;
    if (!adminEmail.trim()) return errorMessages.adminEmail;
  
    for (const question of questions) {
      if (!question.text.trim()) return errorMessages.questionText;
      if (question.options.length < 2) return errorMessages.minOptions;
      if (question.options.some((option) => !option.trim())) return errorMessages.emptyOption;
    }
  
    if (!endTime.trim()) return errorMessages.endTime;
  
    return null;
  };
  