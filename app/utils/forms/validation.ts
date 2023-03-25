import { json } from '@remix-run/server-runtime';

export interface ErrorMessages {[k: string]: string}

export interface FormDataForRefill {[k: string]: FormDataEntryValue | null}

export interface ActionData {
  errors?: ErrorMessages
  formDataForRefill?: FormDataForRefill
}

export type Validator = {
  (value: FormDataEntryValue|null, formData: FormData): string|undefined;
}

export type Parser = {
  (data: {inputName: string, value: FormDataEntryValue|null}): {propName: string, value: any}
}

export type InputValidationObject = {
  inputName: string;
  validators: Validator[];
  parser: Parser;
}

export type InputValidationSchema = InputValidationObject[];

export function validateFormData (formData: FormData, validationSchema: InputValidationSchema) {
  const errors: ErrorMessages = {};
  const formDataForRefill: FormDataForRefill = {};
  validationSchema.forEach(({ inputName, validators }) => {
    const value = formData.get(inputName);
    formDataForRefill[inputName] = value;
    const failedValidator = validators.find(validator => validator(value, formData));
    if (failedValidator) {
      errors[inputName] = failedValidator(value, formData) as string;
    }
  });
  return {errors, formDataForRefill};
}

function parseFormData(formData: FormData, validationSchema: InputValidationSchema) {
  return validationSchema.reduce((acc: {[k: string]: any}, { inputName, parser }) => {
    const value = formData.get(inputName);
    const { propName, value: parsedValue } = parser({inputName, value});
    acc[propName] = parsedValue;
    return acc;
  }
  , {});
}

export function validateAndParseFormData (formData: FormData, validationSchema: InputValidationSchema) {
  const {errors, formDataForRefill} = validateFormData(formData, validationSchema);
  if (someErrors(errors)) {
    return {
      errors,
      formDataForRefill,
      parsedData: {},
    };
  }
  return {
    parsedData: parseFormData(formData, validationSchema),
  };
}


export function someErrors (errors: ErrorMessages) : boolean {
  return Object.keys(errors).length > 0;
}

export function errorResponse (errors: ErrorMessages, formDataForRefill?: FormDataForRefill){
  return json<ActionData>(
    { errors, formDataForRefill },
    { status: 400 }
  );
}
