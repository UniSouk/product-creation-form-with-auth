"use client";

import { api } from "@/lib/axios";
import { errorToast, successToast } from "@/ui/Toast";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { use, useState } from "react";

type RewardAmount = 0 | 5 | 10 | 20;

const STOP_ANGLE_MAP: Record<RewardAmount, number> = {
  0: 360 - 45, // Top-right segment (Gray ₹0) - rotate so center is at top
  5: 360 - 135, // Bottom-right segment (Green ₹5)
  10: 360 - 225, // Bottom-left segment (Blue ₹10)
  20: 360 - 315,
};

export default function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState<RewardAmount | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimRewardId, setClaimRewardId] = useState<String | null>(null);
  const [claimForm, setClaimForm] = useState({
    name: "",
    mobile: "",
  });
  const [claimErrors, setClaimErrors] = useState({
    name: "",
    mobile: "",
  });
  const router = useRouter();
  const [claimed, setClaimed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const params = useSearchParams();
  const productId = params.get("productId");
  const feedbackId = params.get("rewardId");

const spinWheel = async () => {
  if (spinning) return;

  setSpinning(true);
  setReward(null);
  setClaimed(false);

  try {
    // 1️⃣ Call backend first
    const res = await api.post("/api/reward", { feedbackId: feedbackId });
    const amount: RewardAmount = res?.data?.data?.amount;
    const rewardIdFromApi = res?.data?.data?.id;

    setClaimRewardId(rewardIdFromApi);

    // 2️⃣ Calculate rotation based on API reward
    const baseRotation = 360 * 5; // extra spins for animation
    const stopAngle = STOP_ANGLE_MAP[amount];

    setRotation(baseRotation + stopAngle);

    // 3️⃣ Set reward after spin duration
    setTimeout(() => {
      setReward(amount);
      setSpinning(false);
    }, 4000); // match CSS transition duration

  } catch (err) {
    console.error("Error fetching reward:", err);
    setReward(0); // fallback
    setSpinning(false);
  }
};


  const openClaimModal = () => {
    setShowClaimModal(true);
    setClaimForm({ name: "", mobile: "" });
    setClaimErrors({ name: "", mobile: "" });
  };

  const closeClaimModal = () => {
    setShowClaimModal(false);
  };

  const validateClaimForm = () => {
    const errors = { name: "", mobile: "" };
    let isValid = true;

    if (!claimForm.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!claimForm.mobile.trim()) {
      errors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(claimForm.mobile.trim())) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
      isValid = false;
    }

    setClaimErrors(errors);
    return isValid;
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateClaimForm()) return;

    setSubmitting(true);

    try {
      const res = await api.patch("/api/reward", {
        rewardId: claimRewardId,
        name: claimForm?.name,
        phone: claimForm?.mobile,
      });
      const data = res?.data;
      if (data?.data?.cashgramLink) {
        window.location.href = data?.data?.cashgramLink;
      }
      //
      if (res.ok) {
        setClaimed(true);
        setShowClaimModal(false);
        errorToast(data.message || `Reward ₹${reward} claimed successfully!`);
      } else {
        // alert(data.message || "Failed to claim reward. Please try again.");
        errorToast(data.message || "Failed to claim reward. Please try again.")
      }
    } catch (err) {
      console.error("Error claiming reward:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!productId) {
     redirect('/dashboard')
  }

  return (
    <div className="min-h-screen md:bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Card Container */}
        <div className="md:bg-white rounded-lg md:shadow-lg p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              🎉 Congratulations!
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Your feedback has been submitted successfully. Spin the wheel to
              claim your reward!
            </p>
          </div>

          {/* Wheel Section */}
          <div className="flex flex-col items-center mb-8">
            {/* Wheel Container */}
            <div className="relative mb-8">
              {/* Pointer Triangle - Moved up and outside the wheel */}
              <div className="absolute -top-8 sm:-top-10 md:-top-12 left-1/2 transform -translate-x-1/2 z-30">
                <div className="relative flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[12px] sm:border-l-[14px] md:border-l-[16px] border-l-transparent border-r-[12px] sm:border-r-[14px] md:border-r-[16px] border-r-transparent border-t-[24px] sm:border-t-[28px] md:border-t-[32px] border-t-orange-500 drop-shadow-lg" />
                </div>
              </div>

              {/* Wheel Base */}
              <div className="relative">
                {/* Outer Ring */}
                <div className="absolute -inset-2 sm:-inset-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-xl" />

                {/* Main Wheel */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-white shadow-xl overflow-hidden border-4 border-orange-500">
                  <svg
                    className="w-full h-full transition-transform duration-[4000ms] ease-in-out"
                    style={{ transform: `rotate(${rotation}deg)` }}
                    viewBox="0 0 200 200"
                  >
                    <defs>
                      {/* Gradients for segments */}
                      <linearGradient
                        id="grad0"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#9ca3af", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#6b7280", stopOpacity: 1 }}
                        />
                      </linearGradient>
                      <linearGradient
                        id="grad5"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#34d399", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#10b981", stopOpacity: 1 }}
                        />
                      </linearGradient>
                      <linearGradient
                        id="grad10"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#60a5fa", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
                        />
                      </linearGradient>
                      <linearGradient
                        id="grad20"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#fbbf24", stopOpacity: 1 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#f59e0b", stopOpacity: 1 }}
                        />
                      </linearGradient>
                    </defs>

                    {/* Segment 1: ₹0 (Gray) */}
                    <path
                      d="M 100 100 L 100 0 A 100 100 0 0 1 200 100 Z"
                      fill="url(#grad0)"
                      stroke="white"
                      strokeWidth="4"
                    />
                    <text
                      x="150"
                      y="55"
                      textAnchor="middle"
                      fill="white"
                      fontSize="28"
                      fontWeight="700"
                      transform="rotate(45, 150, 55)"
                    >
                      ₹0
                    </text>

                    {/* Segment 2: ₹5 (Green) */}
                    <path
                      d="M 100 100 L 200 100 A 100 100 0 0 1 100 200 Z"
                      fill="url(#grad5)"
                      stroke="white"
                      strokeWidth="4"
                    />
                    <text
                      x="150"
                      y="150"
                      textAnchor="middle"
                      fill="white"
                      fontSize="28"
                      fontWeight="700"
                      transform="rotate(135, 150, 150)"
                    >
                      ₹5
                    </text>

                    {/* Segment 3: ₹10 (Blue) */}
                    <path
                      d="M 100 100 L 100 200 A 100 100 0 0 1 0 100 Z"
                      fill="url(#grad10)"
                      stroke="white"
                      strokeWidth="4"
                    />
                    <text
                      x="50"
                      y="150"
                      textAnchor="middle"
                      fill="white"
                      fontSize="26"
                      fontWeight="700"
                      transform="rotate(225, 50, 150)"
                    >
                      ₹10
                    </text>

                    {/* Segment 4: ₹20 (Orange) */}
                    <path
                      d="M 100 100 L 0 100 A 100 100 0 0 1 100 0 Z"
                      fill="url(#grad20)"
                      stroke="white"
                      strokeWidth="4"
                    />
                    <text
                      x="50"
                      y="55"
                      textAnchor="middle"
                      fill="white"
                      fontSize="26"
                      fontWeight="700"
                      transform="rotate(315, 50, 55)"
                    >
                      ₹20
                    </text>

                    {/* Center Hub */}
                    <circle cx="100" cy="100" r="20" fill="#f97316" />
                    <circle cx="100" cy="100" r="16" fill="#ea580c" />
                    <circle cx="100" cy="100" r="8" fill="white" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-md">
              <button
                type="button"
                onClick={spinWheel}
                disabled={spinning || reward !== null}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-base sm:text-lg font-semibold rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
              >
                {spinning ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Spinning...
                  </span>
                ) : (
                  "SPIN"
                )}
              </button>

              {reward !== null &&
                !claimed &&
                (reward > 0 ? (
                  <button
                    type="button"
                    onClick={openClaimModal}
                    className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-base sm:text-lg font-semibold rounded-2xl shadow-md transition-all duration-200 active:scale-[0.98]"
                  >
                    Claim ₹{reward}
                  </button>
                ) : (
                  <p className="w-full text-center text-red-500 font-semibold text-base sm:text-lg">
                    Better luck next time 🍀
                  </p>
                ))}
            </div>

            {/* Success Message */}
            {reward !== null && claimed && (
              <div className="mt-6 w-full max-w-md">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        Successfully claimed ₹{reward}!
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        Your reward has been added to your account
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {/* <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Daily Reward</p>
                  <p className="text-sm text-gray-600 mt-1">
                    You can spin the wheel once per day after creating a product. Come back tomorrow for another chance to win!
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={closeClaimModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Claim Your ₹{reward} Reward
              </h2>
              <p className="text-gray-600 text-sm">
                Please provide your details to claim the reward
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleClaimSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={claimForm.name}
                  onChange={(e) =>
                    setClaimForm({ ...claimForm, name: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    claimErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {claimErrors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {claimErrors.name}
                  </p>
                )}
              </div>

              {/* Mobile Field */}
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  value={claimForm.mobile}
                  onChange={(e) =>
                    setClaimForm({
                      ...claimForm,
                      mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    claimErrors.mobile ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
                {claimErrors.mobile && (
                  <p className="mt-1 text-sm text-red-500">
                    {claimErrors.mobile}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit & Claim Reward"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
