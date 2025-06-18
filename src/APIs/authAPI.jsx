import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;

export const sendOtp = async (email) => {
  try {
    await axios.post(`${API_BASE_URL}/send-otp`, { email }, {
      headers: { "Content-Type": "application/json" }
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to send OTP. Please try again." };
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp }, {
      headers: { "Content-Type": "application/json" }
    });

    const token = response.data.token;
    return { success: true, token };
  } catch (error) {
    return { success: false, message: "Invalid verification code. Please try again." };
  }
};
