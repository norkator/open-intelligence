/**
 * Predefined colors used first before generating any random ones
 */
const predefinedColors = [
  '#1698af',
  '#1689a0',
  '#156b81',
  '#581564',
  '#791d60',
  '#992956',
  '#ba3447',
  '#d74734',
  '#ee631e',
  '#f9880a'
];

/**
 * Generate random hex color
 * @return hex color
 */
const GetRandomColor = () => {
  const letters = '0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


/**
 * Get hex color for donut index, default predefined, else random
 * @param index array index
 * @return hex color
 */
const GetDonutColor = (index: number) => {
  return index >= predefinedColors.length ? GetRandomColor() : predefinedColors[index];
};


export default GetDonutColor;
