const IncomingData = require('../app/IncomingData');
const Manager = require('../app/Manager');

describe('class IncomingData', () => {
  let manager;

  /**
   * Для многократного использования создаём нового менеджера и входные данные
   * Проверка, к слову, проходит на 0.3s быстрее!
   */
  beforeEach(() => {
    manager = new Manager();
    app = new IncomingData(manager);
  });

  describe('constructor', () => {
    test('receive manager without days', () => {
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
      expect(app.start).toBeInstanceOf(Function);
    });
  });
});
