import type { Validator } from '../validation';

type FormValueCondition = {
  (value: FormDataEntryValue|null, formData: FormData): boolean;
}

export function getValidator (condition: FormValueCondition, message: string) : Validator {
  return (value, formData) => {
    if (condition(value, formData)) {
      return undefined;
    }
    return message;
  };
}

export function getRequireValidator (message: string) : Validator {
  return getValidator(value => (typeof value === "string" && value.length > 0), message);
}

export function getOptionalStringValidator (message: string) : Validator {
  return getValidator(value => (typeof value === "string" || value === undefined), message);
}

export function getOptionalNumberValidator (message: string) : Validator {
  return getValidator(value => ((typeof value === "string" && !isNaN(parseInt(value))) || !value), message);
}

export function getDateValidator (message: string) : Validator {
  return getValidator(value => (typeof value === "string" && value.length > 0 && new Date(value).toString() !== "Invalid Date"), message);
}
