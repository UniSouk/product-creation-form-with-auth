"use client";

import { FormState } from "@/type/feedback-form";
import SelectComp, { Option } from "@/ui/MultiSelexctComp";

type Props = {
  form: FormState;
  update: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  errors: Record<string, string>;
};

export default function Suggestions({ form, update, errors }: Props) {
  return (
    <section
      aria-labelledby="suggestions-heading"
      className="bg-white p-6 md:p-8 rounded-2xl shadow-sm space-y-6"
    >
      <h2
        id="suggestions-heading"
        className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2"
      >
        Suggestions
      </h2>

      <div className="space-y-2 flex flex-col" data-error="suggestion">
        <label className="font-medium text-gray-700">
          What would make this form better for you?<span className="text-red-500"> *</span>
        </label>
        <textarea
          value={form.suggestion}
          onChange={(e) => update("suggestion", e.target.value)}
          rows={4}
          className={`w-full border rounded-xl px-3 py-2 focus:outline-none resize-none ${
            errors.suggestion
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-orange-400"
          }`}
        />
        {errors.suggestion && (
          <p className="text-red-500 text-sm">{errors.suggestion}</p>
        )}
      </div>

      <div className="space-y-2 flex flex-col" data-error="recommend">
        <label className="font-medium text-gray-700">
          Would you recommend others to use this product creation tool?<span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="recommend"
          placeHolder="Select"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          selectedValue={form.recommend}
          getValue={(val: Option) => update("recommend", val)}
        />
        {errors.recommend && (
          <p className="text-red-500 text-sm">{errors.recommend}</p>
        )}
      </div>
    </section>
  );
}
