import type { InputValidationSchema } from './validation';
import { getIdentityParser } from './validation/parser_getters';
import { getRequireValidator } from './validation/validator_getters';



export const signupEventFormValidationSchema: InputValidationSchema = [
  {
    inputName: 'name',
    validators: [ getRequireValidator("Bitte gib deinen Namen an") ],
    parser: getIdentityParser(),
  }, {
    inputName: 'email',
    validators: [ getRequireValidator('Bitte gib eine Email an') ],
    parser: getIdentityParser(),
  }
];