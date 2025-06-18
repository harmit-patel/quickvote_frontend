export const registerUser = async (userData) => {
  try {
      const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/admins/register", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
      });

      const data = await response.json(); // Parse JSON response

      if (!response.ok) {
          throw new Error(data.message || `Error: ${response.status}`);
      }

      return data; // Return the success message from the backend
  } catch (error) {
      console.error("API Error:", error);
      return { message: error.message }; // Ensure message is always returned
  }
};
