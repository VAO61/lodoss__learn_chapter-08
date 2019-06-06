/**
 * Math - встроенный объект, хранящий в своих свойствах и методах различные математические константы и функции.
 * Не является функциональным объектом.
 * Все свойства и методы статичны.
 *
 *
 * Math.Floor округляется к отрицательной бесконечности.
 * Math.Ceiling округляется до положительной бесконечности.
 * Math.Truncate округляется вверх или вниз к нулю.
 * Math.Round округляется до ближайшего целого числа или заданного числа десятичных знаков.
 */

function mathMethods(a, b, c) {
  /**
   * Абсолютное значение
   * Округление
   * Квадратный корень суммы квадратов своих аргументов
   * Кубический корень числа
   */
  let numA = Math.abs(Math.floor(Math.hypot(b, c) - Math.cbrt(a)));
  // return numA;
  console.log(`numA = ${numA}`);

  let numB = Math.round(numA * Math.PI);
  console.log(`numB = ${numB}`);

  return Math.floor(Math.random() * (numB - numA + 1) + numA);
  // return Math.floor(Math.random() * (numB - numA) + numA + 1);
}

console.log(`Random number from numA to numB = ${mathMethods(19227, 4, 3)}
`);
// Math.hypot(4, 3) = квадратный корень (16 + 9)  = 5
// Math.cbrt(19227) = 26.78986399200511
