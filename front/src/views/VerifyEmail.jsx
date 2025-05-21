// views/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get URL parameters from ?expires=...&signature=...&id=...&hash=...
        const expires = searchParams.get("expires");
        const signature = searchParams.get("signature");
        const id = searchParams.get("id");
        const hash = searchParams.get("hash");

        if (!id || !hash || !expires || !signature) {
          setStatus("invalid");
          return;
        }

        // Construct the full backend API URL (Laravel)
        const apiUrl = `/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;

        // Hit the backend verification route
        await axios.get(apiUrl, {
          withCredentials: true, // required if using Sanctum
        });

        setStatus("success");

        // Optionally redirect
        setTimeout(() => navigate("/dashboard"), 2000);
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && <p>Email verified successfully! Redirecting...</p>}
      {status === "error" && <p>Verification failed. Please request a new link.</p>}
      {status === "invalid" && <p>Invalid verification link.</p>}
    </div>
  );
}
