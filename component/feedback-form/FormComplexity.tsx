"use client";

import SelectComp, { Option } from "@/ui/MultiSelexctComp";
import StarRating from "./StarRating";
import { FormState, SECTIONS, TIME_OPTIONS } from "@/type/feedback-form";
import { getRatingStyle } from "@/lib/helper";

const getEffortLabel = (value: number) => {
  switch (value) {
    case 1:
      return { text: "Extremely challenging" };
    case 2:
      return { text: "High effort" };
    case 3:
      return { text: "Moderate" };
    case 4:
      return { text: "Effortless" };
    case 5:
      return { text: "Minimal" };
    default:
      return null;
  }
};

export default function FormComplexity({
  form,
  update,
  errors,
}: {
  form: FormState;
  update: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  errors: Record<string, string>;
}) {
  const showUnderstandability = (value: number | undefined | null) => {
    if (!value) return null;
    return getEffortLabel(value);
  };
  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Form Complexity & Guidance
      </h2>

      {/* Needed help */}
      <div data-error="helpToCompleteForm" className="space-y-2 flex flex-col">
        <label className="font-medium text-gray-700">
          Did you need help to complete any field?<span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="helpToCompleteForm"
          placeHolder="Select"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          selectedValue={form.helpToCompleteForm}
          getValue={(val: Option) => {
            update("helpToCompleteForm", val);
            if (val?.value === "No") {
              update("confusingFields", []);
              update("confusingFieldsOther", "");
            }
          }}
        />
        {errors.helpToCompleteForm && (
          <p className="text-red-500 text-sm">{errors.helpToCompleteForm}</p>
        )}
      </div>

      {/* Confusing fields */}
      {form.helpToCompleteForm?.value === "Yes" && (
        <div data-error="confusingFields" className="space-y-2 flex flex-col">
          <label className="font-medium text-gray-700">
            Which fields were confusing?<span className="text-red-500"> *</span>
          </label>
          <SelectComp
            name="confusingFields"
            isMulti={true}
            placeHolder="Select confusing fields"
            options={[
              ...SECTIONS.map((s) => ({ label: s, value: s })),
              { label: "Other", value: "Other" },
            ]}
            selectedValue={form.confusingFields as unknown as Option | null}
            getValue={(val: any) => {
              if (Array.isArray(val)) update("confusingFields", val);
              else if (!val) update("confusingFields", []);
              else update("confusingFields", [val]);
            }}
          />
          {form.confusingFields.some((f) => f.value === "Other") && (
            <input
              type="text"
              placeholder="Which other field?"
              value={form.confusingFieldsOther}
              onChange={(e) => update("confusingFieldsOther", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          )}
          {errors.confusingFields && (
            <p className="text-red-500 text-sm">{errors.confusingFields}</p>
          )}
        </div>
      )}

      {/* Understood why */}
      <div data-error="isRequired" className="space-y-2 flex flex-col">
        <label className="font-medium text-gray-700">
          Did you understand why required fields are necessary?<span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="isRequired"
          placeHolder="Select"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          selectedValue={
            form.isRequired !== null && form.isRequired !== undefined
              ? {
                  label: form.isRequired ? "Yes" : "No",
                  value: form.isRequired ? "Yes" : "No",
                }
              : null
          }
          getValue={(val: Option) =>
            update("isRequired", val?.value === "Yes")
          }
        />
        {errors.isRequired && (
          <p className="text-red-500 text-sm">{errors.isRequired}</p>
        )}
      </div>

      {/* Effort and time */}
      <div className="space-y-4">
        <div data-error="effortRating" className="space-y-2 flex flex-col">
          <label className="font-medium text-gray-700">
            How much effort did it take to complete this form?<span className="text-red-500"> *</span>
          </label>
          <StarRating
            total={5}
            value={form.effortRating}
            onChange={(v) => update("effortRating", v)}
            error={!!errors.effortRating}
            name="effortRating"
          />
          {showUnderstandability(form.effortRating) && (
            <div
              className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                          text-sm font-medium border shadow-sm 
                          ${getRatingStyle(form.effortRating!)}`}
            >
              {showUnderstandability(form.effortRating)!.text}
            </div>
          )}
          {errors.effortRating && (
            <p className="text-red-500 text-sm">{errors.effortRating}</p>
          )}
        </div>

        <div data-error="timeTaken" className="space-y-2 flex flex-col">
          <label className="font-medium text-gray-700">
            How much time did it take?<span className="text-red-500"> *</span>
          </label>
          <SelectComp
            name="timeTaken"
            placeHolder="Select time range"
            options={TIME_OPTIONS}
            selectedValue={form.timeTaken}
            getValue={(val: Option) => update("timeTaken", val)}
          />
          {errors.timeTaken && (
            <p className="text-red-500 text-sm">{errors.timeTaken}</p>
          )}
        </div>
      </div>
    </section>
  );
}
