const Manager = require('../app/Manager');
// const Project = require('../app/projects/Project');

describe('...', () => {
  describe('...', () => {
    test('should be instance of Manager', () => {
      const manager = new Manager();

      expect(manager.pendingProjects).toBeInstanceOf(Array);
      expect(manager.pendingProjects.length).toBe(0);
      expect(manager.devDoneProjects).toBeInstanceOf(Array);
      expect(manager.devDoneProjects.length).toBe(0);
      expect(manager.doneProjects).toBeInstanceOf(Array);
      expect(manager.doneProjects.length).toBe(0);
      console.log(manager.pendingProjects);
      console.log(manager.pendingProjects.length);
    });
  });
});
