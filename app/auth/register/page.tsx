"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, setAccessToken } from "@/lib/axios";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/images/brand_logo.svg";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const setCookie = (
    name: string,
    value: string,
    expiresInSeconds?: number
  ) => {
    let cookieStr = `${name}=${value}; Path=/; SameSite=Lax`;
    if (process.env.NODE_ENV === "production") cookieStr += "; Secure";
    if (expiresInSeconds) {
      const expires = new Date(
        Date.now() + expiresInSeconds * 1000
      ).toUTCString();
      cookieStr += `; Expires=${expires}`;
    }
    
    if (typeof document !== 'undefined') {
      document.cookie = cookieStr;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPassword ||
      !trimmedConfirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/api/users/register", {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      const data = res.data;

      if (
        !data?.data?.accessToken ||
        !data?.data?.refreshToken ||
        !data?.data?.storeId
      ) {
        setError(data?.message || "Registration failed. Please try again.");
        return;
      }

      const { accessToken, refreshToken, storeId } = data.data;

      const accessPayload = JSON.parse(atob(accessToken.split(".")[1]));
      const refreshPayload = JSON.parse(atob(refreshToken.split(".")[1]));

      setCookie(
        "accessToken",
        accessToken,
        accessPayload.exp - Math.floor(Date.now() / 1000)
      );
      setCookie(
        "refreshToken",
        refreshToken,
        refreshPayload.exp - Math.floor(Date.now() / 1000)
      );
      setCookie("storeId", storeId, 7 * 24 * 60 * 60);

      setAccessToken(accessToken);

      router.push("/dashboard");
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setError("Email already registered. Please log in.");
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <div className="relative w-44 h-full">
            <Image
              src={logo}
              alt="Brand Logo"
              width={56}
              height={56}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Card Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
              Create Account
            </h1>
            <p className="text-center text-gray-500 text-sm">
              Join us and start your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="text-gray-900 text-sm font-medium block mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="w-full border border-gray-300 p-3 rounded-xl placeholder-gray-400 text-sm focus:ring-2 focus:ring-brand-600-orange-p-1 focus:border-transparent focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="text-gray-900 text-sm font-medium block mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full border border-gray-300 p-3 rounded-xl placeholder-gray-400 text-sm focus:ring-2 focus:ring-brand-600-orange-p-1 focus:border-transparent focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="text-gray-900 text-sm font-medium block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full border border-gray-300 p-3 pr-10 rounded-xl placeholder-gray-400 text-sm focus:ring-2 focus:ring-brand-600-orange-p-1 focus:border-transparent focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="text-gray-900 text-sm font-medium block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full border border-gray-300 p-3 pr-10 rounded-xl placeholder-gray-400 text-sm focus:ring-2 focus:ring-brand-600-orange-p-1 focus:border-transparent focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 font-medium bg-red-50 py-3 px-4 rounded-lg border border-red-200 flex items-start gap-2">
                <span className="text-red-500 mt-0.5"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-600-orange-p-1 text-white py-3 rounded-xl font-medium hover:bg-[#e24e1f] active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-brand-600-orange-p-1 text-sm sm:text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-brand-600-orange-p-1 font-semibold hover:underline underline-offset-2 transition"
            >
              Login
            </a>
          </p>
        </div>

        {/* Footer Help Text */}
        <p className="text-center text-xs text-gray-500 mt-6 px-4">
          By creating an account, you agree to our terms of service
        </p>
      </div>
    </div>
  );
}