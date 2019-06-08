const ProjectFactory = require('../../app/_factories/ProjectFactory.js');

describe('receive random numbers', () => {
  test('should be 0 or 1 or 2 or 3 or 4', () => {
    const factory = ProjectFactory;

    for (let i = 0; i < 10000; i++) {
      const number = factory.getRandom(0, 4);

      expect(number >= 0 && number <= 4).toBe(true);
    }
  });
});

// Запуск отдельного теста
// yarn test --runTestsByPath name.test.js
