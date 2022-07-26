// import { json } from '@remix-run/server-runtime';

import { json } from '@remix-run/server-runtime';

interface ErrorMessages {[k: string]: string}

export interface ActionData {
  errors?: ErrorMessages
}

interface Validator {
  (value: FormDataEntryValue|null): string|undefined;
}

interface FormValueCondition {
  (value: FormDataEntryValue|null): boolean;
}

type InputValidationObject = {
  name: string;
  validators: Validator[];
}

export type InputValidationSchema = InputValidationObject[];

export function getValidator (condition: FormValueCondition, message: string) : Validator {
  return (value) => {
    if (condition(value)) {
      return undefined;
    }
    return message;
  };
}

export function getRequireValidator (message: string) : Validator {
  return getValidator(value => (typeof value === "string" && value.length > 0), message);
}

export function getDateValidator (message: string) : Validator {
  return getValidator(value => (typeof value === "string" && value.length > 0 && new Date(value).toString() !== "Invalid Date"), message);
}

export function getFormDataErrors (formData: FormData, validationSchema: InputValidationSchema) : ErrorMessages {
  const errors: ErrorMessages = {};
  validationSchema.forEach(({ name, validators }) => {
    const value = formData.get(name);
    const failedValidator = validators.find(validator => validator(value));
    if (failedValidator) {
      errors[name] = failedValidator(value) as string;
    }
  });
  return errors;
}

export function someErrors (errors: ErrorMessages) : boolean {
  return Object.keys(errors).length > 0;
}

export function errorResponse (errors: ErrorMessages) {
  return json<ActionData>(
    { errors },
    { status: 400 }
  );
}

// export function requireValue(value?: FormDataEntryValue) {
//   if (typeof value !== "string" || value.length === 0) {
//     throw new Error();
//   }
// }

// export function requireFormValues(formValues: {[k: string]: FormDataEntryValue}) {
//   for (const key in formValues) {
//     try {
//       requireValue(formValues[key]);
//     }
//     catch (e) {
//       throw json<ActionData>(
//         { errors: { key: "Event name is required" } },
//         { status: 400 }
//       );
//     }
//   }
// }