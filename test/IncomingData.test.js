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
});
