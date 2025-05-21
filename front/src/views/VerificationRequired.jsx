import { useState, useEffect } from "react";
import axiosClient from "../axios";

export default function VerificationRequired({ user }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // countdown in seconds

  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldown]);

  const resendVerification = async () => {
    setLoading(true);
    try {
      await axiosClient.post("/send-email-verification");
      setSent(true);
      setCooldown(120); // Start 2-minute cooldown
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen text-center text-white bg-zinc-900 px-4">
      <div className="max-w-md">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="mb-4">
          Please verify your email ({user?.email}) to continue using the URL Shortener.
        </p>
        {sent && cooldown === 0 && (
          <p className="text-green-400 mb-4">Verification email sent!</p>
        )}
        <button
          onClick={resendVerification}
          disabled={loading || cooldown > 0}
          className="bg-primary-bg hover:bg-primary-dark font-bold py-2 px-4 rounded text-black"
        >
          {loading
            ? "Sending..."
            : cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Resend Verification Email"}
        </button>
      </div>
    </div>
  );
}
