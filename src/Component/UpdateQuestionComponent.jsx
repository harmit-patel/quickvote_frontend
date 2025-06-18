// import React from "react";

// const UpdateQuestionComponent = ({
//   question,
//   onQuestionChange,
//   onAddOption,
//   onRemoveQuestion,
//   onOptionChange,
//   onRemoveOption,
// }) => {
//   return (
//     <div className="question-container">
//       <input
//         type="text"
//         value={question.text}
//         onChange={(e) => onQuestionChange(e.target.value)}
//         placeholder="Enter question text"
//         className="question-input"
//       />
//       {question.options.map((option, index) => (
//         <div key={index} className="option-container">
//           <input
//             type="text"
//             value={option}
//             onChange={(e) => onOptionChange(index, e.target.value)}
//             placeholder={`Option ${index + 1}`}
//             className="option-input"
//           />
//           <button onClick={() => onRemoveOption(index)} className="remove-option-btn">
//             Remove
//           </button>
//         </div>
//       ))}
//       <button onClick={onAddOption} className="add-option-btn">
//         Add Option
//       </button>
//       <button onClick={onRemoveQuestion} className="remove-question-btn">
//         Remove Question
//       </button>
//     </div>
//   );
// };

// export default UpdateQuestionComponent;
