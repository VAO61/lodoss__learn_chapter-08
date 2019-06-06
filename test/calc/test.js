const operations = require('./operations.js');
const assert = require('assert');

it('Сумма 1 и 3 вычисляется верно?', () => {
  assert.equal(operations.add(1, 3), 4);
});

it('Сумма -1 и -3 вычисляется верно?', () => {
  assert.equal(operations.add(-2, -2), -4);
});

it('Разность 25 и 17 вычисляется верно?', () => {
  assert.equal(operations.substract(25, 17), 8);
});

it('Произведение 12 и 12 вычисляется верно?', () => {
  assert.equal(operations.multiply(12, 12), 144);
});

it('Деление 10 на 2 вычисляется верно?', () => {
  assert.equal(operations.divide(10, 2), 5);
});

it('Не допустимо использование строки вместо числа', () => {
  assert.equal(operations.validateNumbers('sammy', 5), false);
});

it('Не доспустимо использование двух строк вместо чисел', () => {
  assert.equal(operations.validateNumbers('sammy', 'sammy'), false);
});

it('Принимаются два числа?', () => {
  assert.equal(operations.validateNumbers(5, 5), true);
});
