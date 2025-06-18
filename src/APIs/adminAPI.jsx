export const loginAdmin = async (email, password) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admins/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login API error:", error);
    throw new Error("Failed to connect to the server.");
  }
};
