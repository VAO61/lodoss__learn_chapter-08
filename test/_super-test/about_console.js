// console.error('Warning Error!');

// console.warn('Warging message');

// console.info('Info text');

// Очистка консоли
// console.clear();

let fewObjs = {
  firstObj: {
    id: 0,
    name: 'Jennifer',
    age: 25,
    gender: 'female'
  },
  secondObj: {
    id: 1,
    name: 'John',
    age: 19,
    gender: 'male'
  }
};

// Функция нестандартная и отображаться может не корректно
console.table(fewObjs);

let fewAnotherObjs = {
  fhirdObj: {
    id: 0,
    name: 'Lisa',
    age: 25,
    gender: 'female'
  },
  fourthObj: {
    id: 1,
    name: 'Alex',
    age: 19,
    gender: 'male'
  }
};

// Функция нестандартная и отображаться может не корректно
console.table(fewAnotherObjs, ['name', 'gender']);

console.clear();

function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

let somePerson = new Person('Ivan', 'Ivanov');
somePerson.middleName = 'Ivanovich';

// Функция нестандартная. Может, в данном случае и не отображается корректно
console.table(somePerson);

console.warn(
  'Warging: Понять почему undefined в "Лисе" и не работает сортировка свойств в "Покемоне"'
);

console.error(
  'Warning Error: Потому что функция  Console​.table() не является стандартной. Лучше не использовать!'
);

console.table(somePerson);

console.log(somePerson, ['firstName', 'middleName', 'lastName']);
