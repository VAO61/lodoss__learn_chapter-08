# OOP | Patterns | Unit tests

![](https://pbs.twimg.com/media/D5kWTVLWAAEscsj.jpg)

## Ссылочки:

**Как написать хороший README (главная ссылкочка):** [link &#128279;](https://medium.com/nuances-of-programming/%D0%BA%D0%B0%D0%BA-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D1%8C-%D1%85%D0%BE%D1%80%D0%BE%D1%88%D0%B8%D0%B9-readme-%D0%BA%D1%80%D0%B0%D1%82%D0%BA%D0%B8%D0%B9-%D0%BA%D1%83%D1%80%D1%81-79aede120702 'Как написать хороший README')

**Тестирование в JavaScript** (Jest тут нет): [link &#128279;](https://habr.com/ru/post/314978/)

**Jest**: [link &#128279;](https://medium.com/devschacht/berry-de-witte-unit-testing-your-react-application-with-jest-and-enzyme-6ef3658fdc93) Начало работы с Jest: [link &#128279;](https://doc.ebichu.cc/jest/docs/ru/getting-started.html)

---

## Запуск отдельного теста:

_`yarn test --runTestsByPath path/name.test.js`_

### Расшифровка таблицы покрытия кода

**`% Stmts`** - **_Покрытие функций_**. Вызывается ли каждая функция (или подпрограмма) в программе?  
**`% Branches`** - **_Заявление оператора_**. Выполняется ли каждая инструкция в программе?  
**`% Funcs`** - **_Отраслевое покрытие_**. Выполнена ли каждая ветвь (также называемая DD-path) каждой структуры управления (например, в операциях if и case)? Например, с учетом оператора if, выполняются ли как истинная, так и ложная ветки? Другой способ сказать это, было ли выполнено каждое ребро в программе?  
**`% Lines`** - **_Охват линии_**: выполняется ли каждая исполняемая строка в исходном файле?
