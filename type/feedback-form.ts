export interface Option {
  label: string;
  value: string;
}

export type FormState = {
  overallExperience: number;
  formEaseRating: number;

  helpToCompleteForm: Option | null;
  confusingFields: Option[];
  confusingFieldsOther: string;
  isRequired: boolean;
  effortRating: number;
  timeTaken: Option | null;
  timeMinutes: string;

  anyError: Option | null;
  error: string;
  mostTimeTakenFields: Option[];
  isConfused: Option | null;
  confusingMessage: string;

  easyNavigationRating: number;
  foundButtons: Option | null;
  productListingFrequency: Option | null;

  suggestion: string;
  recommend: Option | null;
};

export type IncompleteFormState = {
  gotStuck: Option[];
  stuckReason: string;
  prevented: Option | null;
  preventedReason: string;
  anyError: Option | null;
  errorDescription: string;
  difficulty: number;
  stoppedStep: Option | null;
  neededHelp: Option[];
  neededHelpReason: string;
  device: Option | null;
  suggestion: string;
};

export const SECTIONS = [
  "Basic Info",
  "Pricing",
  "Inventory",
  "Variants",
  "Images",
  "Manufacturing",
  "Publishing Channels",
  "Package",
  "Nothing was confusing",
];

export const TIME_OPTIONS = [
  { label: "Less than 5 minute", value: "<5" },
  { label: "Between 5-15 minute", value: "5-15" },
  { label: "Between 15 - 30 minutes", value: "15-30" },
  { label: "More than 30 minutes", value: ">30" },
];

export const FREQUENCY_OPTIONS = [
  { label: "First time", value: "first" },
  { label: "Occasionally", value: "occasionally" },
  { label: "Frequently", value: "frequently" },
  { label: "Daily", value: "daily" },
];

