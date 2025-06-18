import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmailForm from "./EmailForm";
const useCountdown = (initialValue = 0) => {
  const [countdown, setCountdown] = useState(initialValue);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const startCountdown = (value) => {
    setCountdown(value);
  };

  return [countdown, startCountdown];
};

export default useCountdown;