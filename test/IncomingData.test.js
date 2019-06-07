const IncomingData = require('../app/IncomingData');
const Manager = require('../app/Manager');
// const ProjectFactory = require('./_factories/ProjectFactory.js');

describe('class IncomingData', () => {
  let manager;

  beforeEach(() => {
    manager = new Manager();
  });

  describe('constructor', () => {
    test('receive manager without days', () => {
      const app = new IncomingData(manager);

      expect(app.manager).toBeInstanceOf(Manager);
      expect(app.manager).toBe(manager);
      expect(app.days).toBe(undefined);
    });

    test('receive manager and days', () => {
      const app = new IncomingData(manager, 5);

      expect(app.manager).toBeInstanceOf(Manager);
      expect(app.manager).toBe(manager);
      expect(app.days).toBe(5);
    });
  });

  describe('method start', () => {
    test('should be defined', () => {
      const app = new IncomingData(manager);

      expect(app.start).toBeInstanceOf(Function);
    });
  });

  // describe('receive random numbers', () => {
  //   test('should be 0 or 1 or 2 or 3 or 4', () => {
  //     const app = new IncomingData(manager, 1);
  //     console.log(typeof app);
  //     console.log(typeof app.projects);
  //     // console.log(`\n>>>>>>>>>>>>>  ${app}  <<<<<<<<<<<</n`);

  //     // В received(toBe) указывать несколько значений, видимо, нельзя поэтому:
  //     expect(
  //       app.countProjects === 0 ||
  //         app.countProjects === 1 ||
  //         app.countProjects === 2 ||
  //         app.countProjects === 3 ||
  //         app.countProjects === 4
  //     ).toBe(true);
  //   });
  // });
});
