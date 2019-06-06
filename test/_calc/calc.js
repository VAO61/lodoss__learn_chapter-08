/**
 * Простой калькулятор на Node.js, который использует calculator app that uses
 * встроенный интерфейс командной строки Readline.
 */

const operations = require('./operations.js');
const readline = require('readline'); // Втроенный в Node.js CLI-модуль

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
  Калькулятор на Node.js
  Введите два числа, а затем выберите, что с ними сделать.
`);

rl.question('Введите первое число:', x => {
  rl.question('Введите второе число:', y => {
    rl.question(
      `
      Выберите одну из следующих операций:

      [1] Сложение (+)
      [2] Вычитание (-)
      [3] Умножение (*)
      [4] Деление (/)

      Ваш выбор:
    `,
      choice => {
        // будет еще код
        if (!operations.validateNumbers(x, y)) {
          console.log(`
          Можно вводить только числа!
          Пожалуйста, перезапустите программу.
          `);
        } else {
          /**
           * Инструкция __/ switch /__ сравнивает выражение со случаями, перечисленными внутри неё, а затем выполняет соответствующие инструкции.
           * switch (expression) {
           *    expression - выражение, значение которого сравнивается со всеми случаями
           *  case valueN:
           *    Случай, который проверяется на соответствие выражению (expression)
           *  default:
           *    statements_def - инструкции, выполняемые если (expression) не соответствует ни одному случаю
           * }
           */
          switch (choice) {
            case '1':
              console.log(`Сумма ${x} и ${y} равна ${operations.add(x, y)}.`);
              break;
            case '2':
              console.log(
                `Разность ${x} и ${y} равна ${operations.substract(x, y)}.`
              );
              break;
            case '3':
              console.log(
                `Произведение ${x} и ${y} равно ${operations.multiply(x, y)}.`
              );
              break;
            case '4':
              console.log(
                `Частное ${x} и ${y} равно ${operations.divide(x, y)}.`
              );
              break;
            default:
              console.log(
                `Пожалуйста, перезапустите программу и выберите число от 1 до 4`
              );
              break;
          }
        }
        rl.close();
      }
    );
  });
});
