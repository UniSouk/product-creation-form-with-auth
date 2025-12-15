"use client";

import { useState, useRef } from "react";
import ErrorsFriction from "@/component/feedback-form/ErrorsFriction";
import UINavigation from "@/component/feedback-form/UINavigation";
import Suggestions from "@/component/feedback-form/Suggestions";
import OverallExperience from "@/component/feedback-form/OverallExperience";
import FormComplexity from "@/component/feedback-form/FormComplexity";
import { FormState } from "@/type/feedback-form";
import { api } from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { errorToast, successToast } from "@/ui/Toast";

export default function FeedbackForm() {
  const [form, setForm] = useState<FormState>({
    overallExperience: 0,
    formEaseRating: 0,
    helpToCompleteForm: null,
    confusingFields: [],
    confusingFieldsOther: "",
    isRequired: false,
    effortRating: 0,
    timeTaken: null,
    timeMinutes: "",
    anyError: null,
    error: "",
    mostTimeTakenFields: [],
    isConfused: null,
    confusingMessage: "",
    easyNavigationRating: 0,
    foundButtons: null,
    productListingFrequency: null,
    suggestion: "",
    recommend: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement | null>(null);
  const params = useSearchParams();
  const productId = params.get("productId");
  const router = useRouter();

  const update = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!form.overallExperience)
      newErrors.overallExperience = "Please rate your overall experience.";
    if (!form.formEaseRating)
      newErrors.understandingFields =
        "Please rate how easy the fields were to understand.";
    if (!form.helpToCompleteForm)
      newErrors.helpToCompleteForm = "Please tell us if assistance was needed to complete the form.";
    if (
      form.helpToCompleteForm?.value === "Yes" &&
      (!form.confusingFields || form.confusingFields.length === 0)
    )
      newErrors.confusingFields = "Please select which fields were confusing.";
    // if (!form.isRequired)
    //   newErrors.isRequired =
    //     "Please rate if you understood why required fields are necessary.";
    if (!form.effortRating)
      newErrors.effortRating = "Please rate the effort required.";
    if (!form.timeTaken) newErrors.timeTaken = "Please select time taken.";
    if (!form.anyError) {
      newErrors.anyError = "Please indicate if you encountered any errors.";
    }

    if (form.anyError?.value === "Yes" && !form.error.trim()) {
      newErrors.error = "Please briefly describe the errors you faced."; // match key in JSX
    }
    if (form.mostTimeTakenFields.length === 0) {
      newErrors.mostTimeTakenFields =
        "Please select which step took the most time.";
    }
    if (!form.isConfused)
      newErrors.validationMessagesConfusing =
        "Please indicate if validation messages were confusing.";
    if (form.isConfused?.value === "Yes" && !form.confusingMessage.trim())
      newErrors.validationMessagesConfusingOther =
        "Please specify the confusing messages.";
    if (!form.easyNavigationRating)
      newErrors.easyNavigationRating =
        "Please rate how easy it was to navigate.";
    if (!form.foundButtons)
      newErrors.foundButtons =
        "Please indicate whether actions/buttons were easy to find.";
    if (!form.productListingFrequency)
      newErrors.productListingFrequency =
        "Please tell us how often you list products.";
    if (!form.suggestion.trim())
      newErrors.suggestion = "Please provide a suggestion.";
    if (!form.recommend)
      newErrors.recommend = "Please tell us whether you'd recommend this tool.";
    setErrors(newErrors);
    return newErrors;
  };

  const scrollToFirstError = (errKeys: string[]) => {
    if (!formRef.current || errKeys.length === 0) return;
    const selector = `[data-error="${errKeys[0]}"]`;
    const el = formRef.current.querySelector(selector);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const firstInput = el?.querySelector("button, input, textarea, select");
    (firstInput as HTMLElement | undefined)?.focus?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) {
      scrollToFirstError(Object.keys(err));
      return;
    }
    const payload = {
      productId,

      overallExperience: form.overallExperience,
      formEaseRating: form.formEaseRating,

      helpToCompleteForm: form.helpToCompleteForm?.value === "Yes",

      confusingFields: form.confusingFields.map((o) => o.value ?? o),
      ...(form.confusingFields.some((x) => x.value === "Other") &&
      form.confusingFieldsOther?.trim()
        ? { confusingFieldsOther: form.confusingFieldsOther }
        : {}),

      isRequired: form.isRequired,

      effortRating: form.effortRating,

      timeTaken: form.timeTaken?.value ?? "",

      anyError: form.anyError?.value === "Yes",
      error: form.anyError?.value === "Yes" ? form.error : undefined,
      mostTimeTakenFields: form.mostTimeTakenFields.map((o) => o.value),

      isConfused: form.isConfused?.value === "Yes",
      confusingMessage:
        form.isConfused?.value === "Yes" ? form.confusingMessage : undefined,

      easyNavigationRating: form.easyNavigationRating,

      foundButtons: form.foundButtons?.value === "Yes",

      productListingFrequency: form.productListingFrequency?.value ?? "",

      suggestion: form.suggestion,

      recommend: form.recommend?.value === "Yes",
    };

    try {
      const response = await api.post("/api/feedback/product", payload);

      if (response.ok) {
        successToast(
          response.data.message || "Feedback submitted successfully"
        );
        router.push(`/dashboard/reward?productId=${productId}&rewardId=${response?.data?.data?.id}`);
      }
    } catch (error: any) {
      console.error("Failed to submit feedback:", error);
      errorToast(error?.response?.data?.message)
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto space-y-10 max-md:pb-10 md:p-10 bg-gray-50 rounded-lg md:shadow-lg"
      aria-label="Product creation feedback form"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center max-md:mt-4">
        Product Creation Feedback
      </h1>

      <OverallExperience form={form} update={update} errors={errors} />
      <FormComplexity form={form} update={update} errors={errors} />
      <ErrorsFriction form={form} update={update} errors={errors} />
      <UINavigation form={form} update={update} errors={errors} />
      <Suggestions form={form} update={update} errors={errors} />

      <button
        type="submit"
        className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] text-white font-semibold py-3 rounded-2xl shadow-md transition-transform duration-150"
      >
        Submit & Claim Reward
      </button>
    </form>
  );
}
