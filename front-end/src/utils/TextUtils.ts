/**
 * Simple function is replace non wanted chars
 * @param licensePlate, input license plate
 * @return filtered license plate
 */
export const filterLicensePlate = (licensePlate: string) => {
  return licensePlate.replace('-', '')
    .replace(' ', '');
};
