import { useState, useEffect } from "react";

export default function useAuth() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuth(!!token);
  }, []);

  return auth;
}
