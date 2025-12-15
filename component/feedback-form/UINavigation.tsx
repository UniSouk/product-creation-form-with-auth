"use client";

import SelectComp, { Option } from "@/ui/MultiSelexctComp";
import StarRating from "./StarRating";
import { FormState, FREQUENCY_OPTIONS } from "@/type/feedback-form";
import { getRatingStyle } from "@/lib/helper";

type Props = {
  form: FormState;
  update: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  errors: Record<string, string>;
};

export default function UINavigation({ form, update, errors }: Props) {
  const showLabel = (value: number | undefined | null) => {
    if (!value) return null;
    return {
      1: { text: "Extremely confusing" },
      2: { text: "Somewhat confusing" },
      3: { text: "Average" },
      4: { text: "Easy" },
      5: { text: "Minimal" },
    }[value];
  };

  return (
    <section
      aria-labelledby="ui-heading"
      className="bg-white p-6 md:p-8 rounded-2xl shadow-sm space-y-6"
    >
      <h2
        id="ui-heading"
        className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2"
      >
        UI & Navigation
      </h2>

      <div className="space-y-2 flex flex-col" data-error="easyNavigationRating">
        <label className="font-medium text-gray-700">
          How easy was it to navigate between steps?<span className="text-red-500"> *</span>
        </label>
        <StarRating
          total={5}
          value={form.easyNavigationRating}
          onChange={(v) => update("easyNavigationRating", v)}
          error={!!errors.easyNavigationRating}
          name="easyNavigationRating"
        />
        {showLabel(form.easyNavigationRating) && (
          <div
            className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                text-sm font-medium border shadow-sm 
                ${getRatingStyle(form.easyNavigationRating!)}`}
          >
            {showLabel(form.easyNavigationRating)!.text}
          </div>
        )}
        {errors.easyNavigationRating && (
          <p className="text-red-500 text-sm">{errors.easyNavigationRating}</p>
        )}
      </div>

      <div className="space-y-2 flex flex-col" data-error="foundButtons">
        <label className="font-medium text-gray-700">
          Did you find all actions/buttons easily (e.g., Save, Submit)?<span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="foundButtons"
          placeHolder="Select"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          selectedValue={form.foundButtons}
          getValue={(val: Option) => update("foundButtons", val)}
        />
        {errors.foundButtons && (
          <p className="text-red-500 text-sm">{errors.foundButtons}</p>
        )}
      </div>

      <div className="space-y-2 flex flex-col" data-error="productListingFrequency">
        <label className="font-medium text-gray-700">
          How often do you list products?<span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="productListingFrequency"
          placeHolder="Select frequency"
          options={FREQUENCY_OPTIONS}
          selectedValue={form.productListingFrequency}
          getValue={(val: Option) => update("productListingFrequency", val)}
        />
        {errors.productListingFrequency && (
          <p className="text-red-500 text-sm">{errors.productListingFrequency}</p>
        )}
      </div>
    </section>
  );
}
