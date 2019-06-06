const add = (x, y) => +x + +y;
const substract = (x, y) => +x - +y;
const multiply = (x, y) => +x * +y;
const divide = (x, y) => +x / +y;
const validateNumbers = (x, y) => {
  if (isNaN(x) || isNaN(y)) {
    return false;
  }
  return true;
};
const validateDivide = (x, y) => {
  // else if (x / 0) {
  if (x / y && y == 0) {
    console.log('На ноль делить нельзя!');
    return false;
  }
};

module.exports = {
  add,
  substract,
  multiply,
  divide,
  validateNumbers,
  validateDivide
};
