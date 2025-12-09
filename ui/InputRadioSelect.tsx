import { cn } from "@/lib/helper";

type InputRadioType = {
  labelText: string;
  inputName: string;
  htmlFor: string;
  className?: string;
  labelClass?: string;
  value?: string;
  OnChange?: (val: string) => void;
  checked?: boolean;
  disabled?: boolean;
};

function InputRadioSelect({
  htmlFor,
  inputName,
  labelText,
  className,
  labelClass,
  value,
  OnChange,
  checked,
  disabled,
}: InputRadioType) {
  return (
    <div className={cn("flex gap-2 items-center cursor-pointer", className)}>
      <label className="relative flex items-center cursor-pointer">
        <input
          disabled={disabled}
          checked={checked}
          name={inputName}
          type="radio"
          className={`peer h-4 w-4 cursor-pointer appearance-none rounded-full border transition-all border-Gray-300 ${checked ? "border-brand-600-orange-p-1 bg-brand-600-orange-p-1" : ""}`}
          id={htmlFor}
          value={value}
          onChange={(e) => {
            OnChange && OnChange(e.target.value);
          }}
        />
        <span className={`absolute bg-white w-1.5 h-1.5 rounded-full opacity-0 ${checked ? "opacity-100" : ""} transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer`}></span>
      </label>
      <label
        className={cn("text-Gray-700 text-sm font-medium cursor-pointer", labelClass)}
        htmlFor={htmlFor}
      >
        {labelText}
      </label>
    </div>
  );
}

export default InputRadioSelect;
