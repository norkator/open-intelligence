/**
 * Predefined colors used first before generating any random ones
 */
/*const predefinedColors = [
  '#106174',
  '#136a83',
  '#136a84',
  '#116c8c',
  '#116d90',
  '#116f97',
  '#10709e',
  '#1072a6',
  '#1175b4',
  '#0f77bb',
  '#1079c3',
];*/

/**
 * Generate random hex color
 * @return hex color
 */
/*const GetRandomColor = () => {
  const letters = '0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};*/


/**
 * Get hex color for donut index, default predefined, else random
 * @param index array index
 * @return hex color
 */
const GetDonutColor = (index: number) => {
  // return index >= predefinedColors.length ? GetRandomColor() : predefinedColors[index];
  return "#13697d";
};


export default GetDonutColor;
