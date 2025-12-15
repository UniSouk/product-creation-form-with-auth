"use client";

import SelectComp, { Option } from "@/ui/MultiSelexctComp";
import { FormState, SECTIONS } from "@/type/feedback-form"; // optional, wherever you keep constants

type Props = {
  form: FormState;
  update: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  errors: Record<string, string>;
};

export default function ErrorsFriction({ form, update, errors }: Props) {

  return (
    <section
      aria-labelledby="errors-heading"
      className="bg-white p-6 md:p-8 rounded-2xl shadow-sm space-y-6"
    >
      <h2
        id="errors-heading"
        className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2"
      >
        Errors & Friction
      </h2>

      <div className="space-y-2 flex flex-col" data-error="anyError">
        <label className="font-medium text-gray-700">
          Did you encounter any errors or issues?<span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="anyError"
          placeHolder="Select"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          selectedValue={form.anyError}
          getValue={(val: Option) => {
            update("anyError", val);
            if (val?.value === "No") update("error", "");
          }}
        />
        {errors.anyError && (
          <p className="text-red-500 text-sm">{errors.anyError}</p>
        )}
      </div>

      {form.anyError?.value === "Yes" && (
        <div className="space-y-2" data-error="error">
          <label className="font-medium text-gray-700">
            If yes, please describe them briefly
          </label>
          <textarea
            value={form.error}
            onChange={(e) => update("error", e.target.value)}
            rows={3}
            className={`w-full border rounded-xl px-3 py-2 focus:outline-none resize-none ${
              errors.error
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-orange-400"
            }`}
            placeholder="Short description of the issue and, if possible, steps to reproduce"
          />
          {errors.error && (
            <p className="text-red-500 text-sm">{errors.error}</p>
          )}
        </div>
      )}

      <div className="space-y-2 flex flex-col" data-error="mostTimeTakenFields">
        <label className="font-medium text-gray-700">
          Which step took the most time?<span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="mostTimeTakenFields"
          placeHolder="Select the step"
          options={SECTIONS.map((s) => ({ label: s, value: s }))}
          selectedValue={form.mostTimeTakenFields}
          getValue={(val: Option[]) => update("mostTimeTakenFields", val)}
          isMulti={true}
        />
        {errors.mostTimeTakenFields && (
          <p className="text-red-500 text-sm">{errors.mostTimeTakenFields}</p>
        )}
      </div>

      <div
        className="space-y-2 flex flex-col"
        data-error="validationMessagesConfusing"
      >
        <label className="font-medium text-gray-700">
          Did any field validation messages confuse you?<span className="text-red-500"> *</span>
        </label>
        <SelectComp
          name="validationMessagesConfusing"
          placeHolder="Select"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          selectedValue={form.isConfused}
          getValue={(val: Option) => {
            update("isConfused", val);
            if (val?.value === "No") update("confusingMessage", "");
          }}
        />
        {errors.validationMessagesConfusing && (
          <p className="text-red-500 text-sm">
            {errors.validationMessagesConfusing}
          </p>
        )}

        {form.isConfused?.value === "Yes" && (
          <div className="mt-2" data-error="validationMessagesConfusingOther">
            <label className="font-medium text-gray-700">
              Please specify which messages were confusing:<span className="text-red-500"> *</span>
            </label>
            <textarea
              value={form.confusingMessage || ""}
              onChange={(e) => update("confusingMessage", e.target.value)}
              rows={3}
              placeholder="Describe the confusing validation messages"
              className={`w-full border rounded-xl px-3 py-2 focus:outline-none resize-none ${
                errors.validationMessagesConfusingOther
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-orange-400"
              }`}
            />
            {errors.validationMessagesConfusingOther && (
              <p className="text-red-500 text-sm">
                {errors.validationMessagesConfusingOther}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
