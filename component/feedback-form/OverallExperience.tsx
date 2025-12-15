"use client";

import { getRatingStyle } from "@/lib/helper";
import StarRating from "./StarRating";
import { FormState } from "@/type/feedback-form";

const getRatingLabel = (value: number) => {
  switch (value) {
    case 1:
      return { text: "Worst" };
    case 2:
      return { text: "Bad" };
    case 3:
      return { text: "Average" };
    case 4:
      return { text: "Good" };
    case 5:
      return { text: "Great" };
    default:
      return null;
  }
};

const getUnderstandingValue = (value: number) => {
  switch (value) {
    case 1:
      return { text: "Very Difficult" };
    case 2:
      return { text: "Somewhat Difficult" };
    case 3:
      return { text: "Neutral" };
    case 4:
      return { text: "Easy" };
    case 5:
      return { text: "Very Easy" };
    default:
      return null;
  }
};

export default function OverallExperience({
  form,
  update,
  errors,
}: {
  form: FormState;
  update: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  errors: Record<string, string>;
}) {
  const showLabel = (value: number | undefined | null) => {
    if (!value) return null;
    return getRatingLabel(value);
  };

  const showUnderstandability = (value: number | undefined | null) => {
    if (!value) return null;
    return getUnderstandingValue(value);
  };

  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm space-y-6 max-md:-mt-5">
      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Overall Experience
      </h2>

      <div className="space-y-4">
        <div className="space-y-2 flex flex-col" data-error="overallExperience">
          <label className="font-medium text-gray-700">
            How would you rate your overall experience?<span className="text-red-500"> *</span>
          </label>
          <StarRating
            total={5}
            value={form.overallExperience}
            onChange={(v) => update("overallExperience", v)}
            error={!!errors.overallExperience}
            name="overallExperience"
          />
          {showLabel(form.overallExperience) && (
            <div
              className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                          text-sm font-medium border shadow-sm 
                          ${getRatingStyle(form.overallExperience!)}`}
            >
              {showLabel(form.overallExperience)!.text}
            </div>
          )}
          {errors.overallExperience && (
            <p className="text-red-500 text-sm">{errors.overallExperience}</p>
          )}
        </div>

        <div className="space-y-2 flex flex-col" data-error="understandingFields">
          <label className="font-medium text-gray-700">
            How easy was it to understand the form fields?<span className="text-red-500"> *</span>
          </label>
          <StarRating
            total={5}
            value={form.formEaseRating}
            onChange={(v) => update("formEaseRating", v)}
            error={!!errors.understandingFields}
            name="understandingFields"
          />
          {showLabel(form.formEaseRating) && (
            <div
              className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                          text-sm font-medium border shadow-sm 
                          ${getRatingStyle(form.formEaseRating!)}`}
            >
              {showLabel(form.formEaseRating)!.text}
            </div>
          )}
          {errors.understandingFields && (
            <p className="text-red-500 text-sm">{errors.understandingFields}</p>
          )}
        </div>
      </div>
    </section>
  );
}
