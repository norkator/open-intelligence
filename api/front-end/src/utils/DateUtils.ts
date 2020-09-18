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