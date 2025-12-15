"use client";

import { useState, useRef } from "react";
import StarRating from "@/component/feedback-form/StarRating";
import SelectComp, { Option } from "@/ui/MultiSelexctComp";
import InputRadioSelect from "@/ui/InputRadioSelect";
import { api } from "@/lib/axios";
import {
  completionHelpOptions,
  deviceOptions,
  initialFormState,
  preventedOptions,
  stopStepOptions,
  stuckOptions,
} from "@/constant";
import { IncompleteFormState } from "@/type/feedback-form";
import { getRatingStyle } from "@/lib/helper";
import { successToast } from "@/ui/Toast";

const inputClass =
  "w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 mt-2";

const errorInputClass =
  "w-full border border-red-500 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 mt-2";

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

export default function IncompleteFormFeedback() {
  const [form, setForm] = useState<IncompleteFormState>({
    gotStuck: [],
    stuckReason: "",
    prevented: null,
    preventedReason: "",
    anyError: null,
    errorDescription: "",
    difficulty: 0,
    stoppedStep: null,
    neededHelp: [],
    neededHelpReason: "",
    device: null,
    suggestion: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement | null>(null);

  const update = <K extends keyof IncompleteFormState>(
    key: K,
    val: IncompleteFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: val }));

  // Multi-select toggle
  const toggleMultiSelect = (
    key: "gotStuck" | "neededHelp",
    option: Option
  ) => {
    const current = form[key];
    const exists = current.find((o) => o.value === option.value);
    if (exists)
      update(key, current.filter((o) => o.value !== option.value) as any);
    else update(key, [...current, option] as any);
  };

  // Map rating to text
  const showLabel = (value: number | undefined | null) => {
    if (!value) return null;
    return getUnderstandingValue(value);
  };

  // Validation
  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (form.gotStuck.length === 0)
      newErrors.gotStuck = "Please select where you got stuck.";
    if (
      form.gotStuck.find((o) => o.value === "other") &&
      !form.stuckReason.trim()
    )
      newErrors.stuckReason = "Please specify where you got stuck.";
    if (!form.prevented)
      newErrors.prevented =
        "Please select what prevented you from completing the form.";
    if (form.prevented?.value === "other" && !form.preventedReason.trim())
      newErrors.preventedReason = "Please specify what prevented you.";
    if (!form.anyError)
      newErrors.anyError = "Please indicate if you saw an error message.";
    if (form.anyError?.value === "Yes" && !form.errorDescription.trim())
      newErrors.errorDescription = "Please describe the error message.";
    if (form.difficulty === 0)
      newErrors.difficulty = "Please rate the difficulty.";
    if (!form.stoppedStep)
      newErrors.stoppedStep = "Please select the step you stopped at.";
    if (form.neededHelp.length === 0)
      newErrors.neededHelp = "Please select what would have helped you.";
    if (
      form.neededHelp.find((o) => o.value === "other") &&
      !form.neededHelpReason.trim()
    )
      newErrors.neededHelpReason = "Please specify what would have helped.";
    if (!form.device) newErrors.device = "Please select your device.";
    if (!form.suggestion.trim())
      newErrors.suggestion = "Please provide your suggestions.";
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) return;

    try {
      const payload = {
        gotStuck: form.gotStuck.map((o) => o.value),
        stuckReason: form.stuckReason,
        prevented: form.prevented?.value || null,
        preventedReason: form.preventedReason,
        anyError: form.anyError?.value === "Yes" ? true : false,
        errorDescription: form.errorDescription,
        difficulty: form.difficulty,
        stoppedStep: form.stoppedStep?.value || null,
        neededHelp: form.neededHelp.map((o) => o.value),
        neededHelpReason: form.neededHelpReason,
        device: form.device?.value || null,
        suggestion: form.suggestion,
      };

      const response = await api.post("/api/feedback", payload);
      successToast(response?.data?.message || "Feedback form submitted");

      // Reset form
      setForm({ ...initialFormState });
      setErrors({});
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6 p-4 md:p-6 bg-white rounded-2xl md:shadow-md max-w-4xl mx-auto"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">
          Product Form Feedback
        </h2>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-red-500">
            All fields are mandatory
          </span>
        </p>
      </div>

      <hr />

      {/* 1️⃣ Where did you get stuck? */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">
          Where did you get stuck? <span className="text-red-500"> *</span>
          <br />
          <span className="text-xs text-Gray-500">(Select all that apply)</span>
        </label>
        <div className="flex flex-col gap-2 mt-3">
          {stuckOptions.map((option) => (
            <InputRadioSelect
              key={option.value}
              htmlFor={option.value}
              inputName="gotStuck"
              labelText={option.label}
              checked={!!form.gotStuck.find((o) => o.value === option.value)}
              OnChange={() => toggleMultiSelect("gotStuck", option)}
            />
          ))}
        </div>
        {form.gotStuck.find((o) => o.value === "other") && (
          <input
            type="text"
            placeholder="Please specify"
            value={form.stuckReason}
            onChange={(e) => update("stuckReason", e.target.value)}
            className={errors.stuckReason ? errorInputClass : inputClass}
          />
        )}
        {errors.gotStuck && (
          <p className="text-red-500 text-sm">{errors.gotStuck}</p>
        )}
        {errors.stuckReason && (
          <p className="text-red-500 text-sm">{errors.stuckReason}</p>
        )}
      </div>

      {/* 2️⃣ What prevented you from completing? */}
      <div className="space-y-2 flex flex-col">
        <label className="font-medium text-gray-700">
          What prevented you from completing the form?
          <span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="prevented"
          placeHolder="Select"
          options={preventedOptions}
          selectedValue={form.prevented}
          getValue={(val: Option) => update("prevented", val)}
        />
        {form.prevented?.value === "other" && (
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Please specify"
              value={form.preventedReason}
              onChange={(e) => update("preventedReason", e.target.value)}
              className={errors.preventedReason ? errorInputClass : inputClass}
            />
          </div>
        )}
        {errors.prevented && (
          <p className="text-red-500 text-sm">{errors.prevented}</p>
        )}
        {errors.preventedReason && (
          <p className="text-red-500 text-sm">{errors.preventedReason}</p>
        )}
      </div>

      {/* 3️⃣ Did you see any error message? */}
      <div className="space-y-2 flex flex-col">
        <label className="font-medium text-gray-700">
          Did you see any error message?<span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="anyError"
          placeHolder="Select"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          selectedValue={form.anyError}
          getValue={(val: Option) => update("anyError", val)}
        />
        {form.anyError?.value === "Yes" && (
          <textarea
            rows={3}
            placeholder="Please describe the error message"
            value={form.errorDescription}
            onChange={(e) => update("errorDescription", e.target.value)}
            className={
              errors.errorDescription
                ? errorInputClass
                : inputClass + " resize-none"
            }
          />
        )}
        {errors.anyError && (
          <p className="text-red-500 text-sm">{errors.anyError}</p>
        )}
        {errors.errorDescription && (
          <p className="text-red-500 text-sm">{errors.errorDescription}</p>
        )}
      </div>

      {/* 4️⃣ Difficulty rating */}
      <div className="space-y-2 flex flex-col">
        <label className="font-medium text-gray-700">
          How difficult was it to complete the product form?
          <span className="text-red-500"> *</span>
        </label>
        <StarRating
          total={5}
          value={form.difficulty}
          onChange={(v) => update("difficulty", v)}
          error={!!errors.difficulty}
          name="difficulty"
        />
        {showLabel(form.difficulty) && (
          <div
            className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                                 text-sm font-medium border shadow-sm 
                                 ${getRatingStyle(form.difficulty!)}`}
          >
            {showLabel(form.difficulty)!.text}
          </div>
        )}
        {errors.difficultyRating && (
          <p className="text-red-500 text-sm">{errors.difficultyRating}</p>
        )}
      </div>

      {/* 5️⃣ At which step did you stop? */}
      <div className="space-y-2 flex flex-col">
        <label className="font-medium text-gray-700">
          At which step did you stop?<span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="stoppedStep"
          placeHolder="Select step"
          options={stopStepOptions}
          selectedValue={form.stoppedStep}
          getValue={(val: Option) => update("stoppedStep", val)}
        />
        {errors.stoppedStep && (
          <p className="text-red-500 text-sm">{errors.stoppedStep}</p>
        )}
      </div>

      {/* 6️⃣ What would have helped? */}
      <div className="space-y-2 flex flex-col">
        <label className="font-medium text-gray-700">
          What would have helped you complete the product creation?
          <span className="text-red-500"> *</span>
          <br />
          <span className="text-xs text-Gray-500">(Select all that apply)</span>
        </label>
        <div className="flex flex-col gap-2 mt-2 md:mt-1">
          {completionHelpOptions.map((option) => (
            <InputRadioSelect
              key={option.value}
              htmlFor={option.value}
              inputName="neededHelp"
              labelText={option.label}
              checked={!!form.neededHelp.find((o) => o.value === option.value)}
              OnChange={() => toggleMultiSelect("neededHelp", option)}
              className="text-base!"
            />
          ))}
        </div>
        {form.neededHelp.find((o) => o.value === "other") && (
          <input
            type="text"
            placeholder="Please specify"
            value={form.neededHelpReason}
            onChange={(e) => update("neededHelpReason", e.target.value)}
            className={errors.neededHelpReason ? errorInputClass : inputClass}
          />
        )}
        {errors.neededHelp && (
          <p className="text-red-500 text-sm">{errors.neededHelp}</p>
        )}
        {errors.neededHelpReason && (
          <p className="text-red-500 text-sm">{errors.neededHelpReason}</p>
        )}
      </div>

      {/* 7️⃣ Device */}
      <div className="space-y-2 flex flex-col">
        <label className="font-medium text-gray-700">
          What device were you using?<span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="device"
          placeHolder="Select device"
          options={deviceOptions}
          selectedValue={form.device}
          getValue={(val: Option) => update("device", val)}
        />
        {errors.device && (
          <p className="text-red-500 text-sm">{errors.device}</p>
        )}
      </div>

      <div className="space-y-2 flex flex-col">
        <label className="font-medium text-gray-700">
          Any suggestions for improving the product form?
          <span className="text-red-500"> *</span>
        </label>
        <textarea
          rows={4}
          placeholder="Share your suggestions here..."
          value={form.suggestion || ""}
          onChange={(e) =>
            update("suggestion" as keyof IncompleteFormState, e.target.value)
          }
          className={inputClass + " resize-none"}
        />
        {errors.suggestion && (
          <p className="text-red-500 text-sm">{errors.suggestion}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-2xl shadow-md transition-colors"
      >
        Submit Feedback
      </button>
    </form>
  );
}
