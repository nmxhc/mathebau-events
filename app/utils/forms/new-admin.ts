import type { InputValidationSchema } from './validation';
import { getIdentityParser } from './validation/parser_getters';
import { getRequireValidator } from './validation/validator_getters';

export const newAdminFormValidationSchema: InputValidationSchema = [
  {
    inputName: 'newName',
    validators: [ getRequireValidator('Der Admin braucht einen Namen') ],
    parser: getIdentityParser({renamePropertyTo: 'name'}),
  },
  {
    inputName: 'newEmail',
    validators: [ getRequireValidator('Der Admin braucht eine E-Mail-Adresse') ],
    parser: getIdentityParser({renamePropertyTo: 'email'}),
  },
  {
    inputName: 'newPassword',
    validators: [ getRequireValidator('Der Admin braucht ein Passwort') ],
    parser: getIdentityParser({renamePropertyTo: 'password'}),
  },
]