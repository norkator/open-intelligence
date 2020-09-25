/**
 * Get today date
 * @return String date in ISO format
 */
export const getNowISODate = (): string => {
  return new Date().toISOString().substr(0, 10);
};

/**
 * Increment or decrement X days from ISO String date
 * @param selectedDate ISO string date YYYY-MM-DD
 * @param days number of days, positive or nagative value
 * @constructor
 */
export const ChangeDate = (selectedDate: string, days: number) => {
  let date = new Date(selectedDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().substr(0, 10);
};

/**
 * Is provided date timestamp older than one hour
 * @param date action date
 * @constructor
 * @return boolean
 */
export const DateIsOlderThanHour = (date: number): boolean => {
  const hour = 1000 * 60 * 60;
  const hourAgo = Date.now() - hour;
  return date < hourAgo;
};
