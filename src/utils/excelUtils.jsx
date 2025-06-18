import * as XLSX from "xlsx";

export const parseExcelFile = (file, setQuestions, setFileName) => {
  if (!file) return;
  
  setFileName(file.name);
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    // Check the headers in the first row
    const headers = jsonData[0].map(header => String(header).toLowerCase());
    
    // Find the specific column indexes
    const questionNoIndex = headers.findIndex(header => 
      header.includes("question no") || header.includes("question no.") || header === "no" || header === "no.");
    
    const questionIndex = headers.findIndex(header => 
      header === "question" || header.includes("question text"));
    
    // Find where options start
    const optionStartIndex = headers.findIndex(header => 
      header.includes("option") || header.includes("choice"));
    
    // Default to column positions if headers aren't clearly labeled
    const qNoIdx = questionNoIndex !== -1 ? questionNoIndex : 0;
    const qIdx = questionIndex !== -1 ? questionIndex : 1;
    const optIdx = optionStartIndex !== -1 ? optionStartIndex : 2;
    
    const formattedQuestions = jsonData.slice(1).map((row) => {
      return {
        questionId: row[qNoIdx], // Question No. goes to questionId
        text: row[qIdx],        // Question content goes to text
        options: optionStartIndex !== -1 
          ? row.slice(optIdx).filter(Boolean)  // Get options starting from first option column
          : row.slice(Math.max(qNoIdx, qIdx) + 1).filter(Boolean) // Fallback if option columns not clearly labeled
      };
    });
    
    setQuestions(formattedQuestions);
  };
  
  reader.readAsArrayBuffer(file);
};