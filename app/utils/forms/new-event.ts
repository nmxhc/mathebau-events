import { getTodayDateString } from '../dates';
import type { InputValidationSchema } from './validation';
import { getDateParser, getNumberOrNullParser, getIdentityParser } from './validation/parser_getters';
import { getDateValidator, getRequireValidator, getOptionalNumberValidator, getOptionalStringValidator, getValidator } from './validation/validator_getters';

const requireEventName = getRequireValidator("Dein Event braucht einen Namen");
const requireLocation = getRequireValidator("Dein Event braucht einen Ort");
const requireStartDate = getRequireValidator("Dein Event braucht ein Startdatum");
const requireEndDate = getRequireValidator("Dein Event braucht ein Enddatum");
const requireDescription = getRequireValidator("Dein Event braucht eine Beschreibung");
const requireSignupStartDate = getRequireValidator("Dein Event braucht einen Anmeldestart");
const requireSignupEndDate = getRequireValidator("Dein Event braucht einen Anmeldeschluss");
const requireParticipantsLimitToBeNumberOrUnset = getOptionalNumberValidator("Die Teilnehmeranzahl muss eine Zahl sein");
const requireCostToBeStringOrUnset = getOptionalStringValidator("Die Kosten müssen als Text eingegeben werden");

const requireStartDateToBeADate = getDateValidator("Ungültiges Startdatum");
const requireEndDateToBeADate = getDateValidator("Ungültiges Enddatum");
const requireSignupStartDateToBeADate = getDateValidator("Ungültiger Anmeldestart");
const requireSignupEndDateToBeADate = getDateValidator("Ungültiger Anmeldeschluss");

const requireDateToBeTodayOrInFuture = getValidator((value) => {
  const today = new Date(getTodayDateString());
  const date = new Date(value as string);
  if (date < today) {
    return false;
  }
  return true;
}, 'Das Datum muss in der Zukunft liegen');

//TODO: Refactor
const requireEndDateToBeAfterStartDate = getValidator((value, formData) => {
  const startDate = formData.get("startDate");
  if (typeof startDate === "string") {
    const endDate = value as string;
    if (new Date(endDate) < new Date(startDate)) {
      return false;
    }
  }
  return true;
}, "Startdatum muss vor dem Enddatum liegen");

const requireSignupEndDateToBeAfterSignupStartDate = getValidator((value, formData) => {
  const signupStartDate = formData.get("signupStartDate");
  if (typeof signupStartDate === "string") {
    const signupEndDate = value as string;
    if (new Date(signupEndDate) < new Date(signupStartDate)) {
      return false;
    }
  }
  return true;
}, "Anmeldeschluss muss nach dem Anmeldestart liegen");

const requireSignupEndDateToBeStrictlyBeforeStartDate = getValidator((value, formData) => {
  const startDate = formData.get("startDate");
  if (typeof startDate === "string") {
    const signupEndDate = value as string;
    if (new Date(signupEndDate) < new Date(startDate)) {
      return true;
    }
  }
  return false;
}, "Anmeldeschluss muss vor dem Startdatum liegen");

const requireSignupStartDateToBeBeforeStartDate = getValidator((value, formData) => {
  const startDate = formData.get("startDate");
  if (typeof startDate === "string") {
    const signupStartDate = value as string;
    if (new Date(signupStartDate) > new Date(startDate)) {
      return false;
    }
  }
  return true;
}, "Anmeldestart muss vor dem Startdatum liegen");

export const newEventFormValidationSchema: InputValidationSchema = [
  {
    inputName: 'eventName',
    validators: [ requireEventName ],
    parser: getIdentityParser({renamePropertyTo: 'name'}),
  }, {
    inputName: 'location',
    validators: [ requireLocation ],
    parser: getIdentityParser(),
  }, {
    inputName: 'startDate',
    validators: [ requireStartDate, requireStartDateToBeADate, requireDateToBeTodayOrInFuture ],
    parser: getDateParser(),
  }, {
    inputName: 'endDate',
    validators: [ requireEndDate, requireEndDateToBeADate, requireDateToBeTodayOrInFuture, requireEndDateToBeAfterStartDate ],
    parser: getDateParser(),
  }, {
    inputName: 'description',
    validators: [ requireDescription ],
    parser: getIdentityParser(),
  }, {
    inputName: 'signupStartDate',
    validators: [
      requireSignupStartDate, requireSignupStartDateToBeADate, requireDateToBeTodayOrInFuture,
      requireSignupStartDateToBeBeforeStartDate ],
    parser: getDateParser(),
  }, {
    inputName: 'signupEndDate',
    validators: [ requireSignupEndDate, requireSignupEndDateToBeADate, requireDateToBeTodayOrInFuture,
      requireSignupEndDateToBeStrictlyBeforeStartDate, requireSignupEndDateToBeAfterSignupStartDate ],
    parser: getDateParser(),
  }, {
    inputName: 'participantsLimit',
    validators: [requireParticipantsLimitToBeNumberOrUnset],
    parser: getNumberOrNullParser(),
  }, {
    inputName: 'cost',
    validators: [requireCostToBeStringOrUnset],
    parser: getIdentityParser(),
  }
]