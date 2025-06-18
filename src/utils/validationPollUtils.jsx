// src/utils/validationUtils.js
export const validatePoll = (title, question, endTime) => {
    if (!title.trim()) {
      return "The poll must have a title.";
    }
    if (!question.text.trim()) {
      return "The question must have text.";
    }
    if (question.options.length < 2) {
      return "Each question must have at least two options.";
    }
    if (question.options.some((option) => !option.trim())) {
      return "No option can be empty.";
    }
    if (!endTime.trim()) {
      return "End time is required.";
    }
    return null;
  };
  