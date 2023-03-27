import { dateStringPlusDays, getTodayDateString, getTomorrowDateString, todayIsBetween } from './dates';

test('todayIsBetween returns false when not between start and end', () => {
  expect(todayIsBetween('2020-01-01', '2020-01-03')).toBe(false);
  expect(todayIsBetween('3020-01-01', '3020-01-03')).toBe(false);
})

test('todayIsBetween returns true when today is start or end', () => {
  expect(todayIsBetween(getTodayDateString(), getTodayDateString())).toBe(true);
})

test('todayIsBetween returns true when today is between start and end', () => {
  expect(todayIsBetween(dateStringPlusDays(getTodayDateString(), -1), getTomorrowDateString())).toBe(true);
})