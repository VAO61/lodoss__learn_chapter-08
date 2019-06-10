const Manager = require('../app/Manager');
const Project = require('../app/projects/Project');
// const IncomingData = require('../app/IncomingData');

describe('class Manager', () => {
  let manager;

  beforeEach(() => {
    manager = new Manager();
  });

  describe('constructor', () => {
    /**
     * В данном случае нет особой необходимости в тесте этих массивов, т.к. вряд ли что-то может пойти не так после записи this.name = [];
     */
    test('should create clear specialized projects arrays & should be instance of array', () => {
      expect(manager.pendingProjects).toBeInstanceOf(Array);
      expect(manager.pendingProjects.length).toBe(0);
      expect(manager.devDoneProjects).toBeInstanceOf(Array);
      expect(manager.devDoneProjects.length).toBe(0);
      expect(manager.doneProjects).toBeInstanceOf(Array);
      expect(manager.doneProjects.length).toBe(0);
    });
  });
  describe('method addProjects', () => {
    test('should receive array projects with correct account', () => {
      const firstProject = new Project();
      const secondProject = new Project();
      const thirdProject = new Project();

      manager.addProjects([firstProject]);
      manager.addProjects([secondProject]);
      manager.addProjects([thirdProject]);

      expect(manager.pendingProjects).toBeInstanceOf(Array);
      expect(manager.pendingProjects.length).toBe(3);
      expect(manager.pendingProjects[0]).toBe(firstProject);
      expect(manager.pendingProjects[1]).toBe(secondProject);
      expect(manager.pendingProjects[0] == thirdProject).toBe(false);
    });
  });
});
