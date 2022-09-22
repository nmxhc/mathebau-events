import { getEndOfDay } from '~/utils/dates';
import type { Parser } from '../validation';

export function getParser( parseValue: (value:FormDataEntryValue|null) => any, options? : {renamePropertyTo?: string}): Parser {
  return ({inputName, value}) => {
    return {propName: options?.renamePropertyTo || inputName , value: parseValue(value)}
  }
}

export function getIdentityParser ( options? : {renamePropertyTo?: string}) : Parser {
  return getParser(value => value, options);
}

export function getNumberOrNullParser () {
  return getParser(value => value ? parseInt(value as string) : null);
}

export function getDateParser () {
  return getParser(value => new Date(value as string));
}

export function getEndOfDayDateParser () {
  return getParser(value => getEndOfDay(value as string));
}

export function getCheckboxToStringParser () {
  return getParser(value => value ? 'true' : 'false');
}