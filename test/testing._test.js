const getRandom = require('../app/testing.js');

describe('receive random numbers', () => {
  test('should be 0 or 1 or 2 or 3 or 4', () => {
    const getRandomTest = getRandom(0, 4);
    console.log(getRandomTest);

    expect(
      getRandomTest === 0 ||
        getRandomTest === 1 ||
        getRandomTest === 2 ||
        getRandomTest === 3 ||
        getRandomTest === 4
    ).toBe(true);
  });
});
