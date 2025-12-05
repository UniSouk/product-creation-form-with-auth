"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form);

    const res = await fetch("https://your-api.com/register", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      setError("Registration failed. Try again.");
      return;
    }

    router.push("/auth/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-[#101828] text-center">
          Create Account
        </h1>
        <p className="text-center mt-1 text-gray-500 text-sm">
          Join us and start your journey
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-[#101828] text-sm font-medium">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="w-full mt-1 border border-gray-300 p-3 rounded-xl placeholder-gray-400
              focus:ring-2 focus:ring-[#F75A27] focus:outline-none transition"
            />
          </div>

          <div>
            <label className="text-[#101828] text-sm font-medium">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              required
              className="w-full mt-1 border border-gray-300 p-3 rounded-xl placeholder-gray-400
              focus:ring-2 focus:ring-[#F75A27] focus:outline-none transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium bg-red-50 py-2 px-3 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#F75A27] text-white py-3 rounded-xl font-medium 
            hover:bg-[#e24e1f] transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-[#F75A27] font-medium underline underline-offset-2"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
