import type { InputValidationSchema } from './validation';
import { getDateValidator, getRequireValidator } from './validation';

const requireEventName = getRequireValidator("Dein Event braucht einen Namen");
  const requireLocation = getRequireValidator("Dein Event braucht einen Ort");
  const requireStartDate = getRequireValidator("Dein Event braucht ein Startdatum");
  const requireEndDate = getRequireValidator("Dein Event braucht ein Enddatum");
  const requireDescription = getRequireValidator("Dein Event braucht eine Beschreibung");
  const requireSignupStartDate = getRequireValidator("Dein Event braucht einen Anmeldestart");
  const requireSignupEndDate = getRequireValidator("Dein Event braucht einen Anmeldeschluss");

  const requireStartDateToBeADate = getDateValidator("Das Startdatum muss ein Datum sein");

export const newEventFormValidationSchema: InputValidationSchema = [
  {
    name: 'eventName',
    validators: [ requireEventName ],
  }, {
    name: 'location',
    validators: [ requireLocation ],
  }, {
    name: 'startDate',
    validators: [ requireStartDate, requireStartDateToBeADate ],
  }, {
    name: 'endDate',
    validators: [ requireEndDate ],
  }, {
    name: 'description',
    validators: [ requireDescription ],
  }, {
    name: 'signupStartDate',
    validators: [ requireSignupStartDate ],
  }, {
    name: 'signupEndDate',
    validators: [ requireSignupEndDate ],
  }
]