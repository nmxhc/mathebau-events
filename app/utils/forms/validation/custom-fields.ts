import type { getEventById } from '~/models/event.server';
import type { InputValidationSchema, Validator } from '../validation';
import { getCheckboxToStringParser, getIdentityParser } from './parser_getters';
import { getOptionalNumberValidator, getRequireValidator } from './validator_getters';

type EIFs = NonNullable<Awaited<ReturnType<typeof getEventById>>>['eventInputFields'];

export function getCustomFieldsValidationSchema(eIFs: EIFs) {
  const validationSchema: InputValidationSchema = [];
  for (const eIF of eIFs) {
    const validators: Validator[] = [];
    let parser = getIdentityParser();
    if (eIF.inputField.required) {
      validators.push(getRequireValidator(`Bitte gib ${eIF.inputField.name} an`));
    }
    if (eIF.inputField.typeId === 'number') {
      validators.push(getOptionalNumberValidator(`Bitte gib eine Zahl für ${eIF.inputField.name} an`));
    }
    if (eIF.inputField.typeId === 'checkbox') {
      parser = getCheckboxToStringParser();
    }
    validationSchema.push({
      inputName: eIF.inputField.name,
      validators,
      parser,
    });
  }
  return validationSchema
}