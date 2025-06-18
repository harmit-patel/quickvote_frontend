import axios from "axios";

const getInstitute = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/getInstitute`);

  // Clean and transform the data
  const cleaned = response.data
    .filter(name => name.trim() !== "") // Remove empty or whitespace-only strings
    .map((name, index) => ({
      id: index,
      label: name,
      value: name.toLowerCase()
    }));

  return cleaned;
};

export default getInstitute;
