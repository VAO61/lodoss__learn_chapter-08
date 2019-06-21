const Department = require('../../app/department/Department');
const Developer = require('../../app/developers/Developer');
const Project = require('../../app/projects/Project');

describe('class Department', () => {
  describe('method getUnBusyDevelopers', () => {
    test('should receive array with two elements', () => {
      const department = new Department();
      const project = new Project();
      const developer1 = new Developer();
      const developer2 = new Developer();
      const developer3 = new Developer();
      developer2.startProject(project);
      department.developers.push(developer1, developer2, developer3);

      const unBusyDevelopers = department.getUnBusyDevelopers();

      expect(unBusyDevelopers.length).toBe(2);
      expect(unBusyDevelopers).toEqual([developer1, developer3]);
    });

    test('should receive empty array', () => {
      const department = new Department();
      const project = new Project();
      const developer1 = new Developer();
      const developer2 = new Developer();
      const developer3 = new Developer();
      developer1.startProject(project);
      developer2.startProject(project);
      developer3.startProject(project);
      department.developers.push(developer1, developer2, developer3);

      const unBusyDevelopers = department.getUnBusyDevelopers();

      expect(unBusyDevelopers.length).toBe(0);
    });
  });

  describe('method getUnBusyDeveloper', () => {
    test('should receive the most unskill unbusy developer (developer1)', () => {
      const department = new Department();
      const project = new Project();
      const developer1 = new Developer();
      const developer2 = new Developer();
      const developer3 = new Developer();
      developer2.startProject(project);
      developer1.skill = 1;
      developer3.skill = 5;
      department.developers.push(developer1, developer2, developer3);

      const unBusyDeveloper = department.getUnBusyDeveloper();

      expect(unBusyDeveloper).toBeInstanceOf(Developer);
      expect(unBusyDeveloper).toBe(developer1);
    });

    test('should receive undefined', () => {
      const department = new Department();
      const project = new Project();
      const developer1 = new Developer();
      const developer2 = new Developer();
      const developer3 = new Developer();
      developer1.startProject(project);
      developer2.startProject(project);
      developer3.startProject(project);
      department.developers.push(developer1, developer2, developer3);

      const unBusyDeveloper = department.getUnBusyDeveloper();

      expect(typeof unBusyDeveloper).toBe('undefined');
    });
  });

  describe('method firedDevelopers', () => {
    test('should fire the most unskill unbusy developer (developer1)', () => {
      const department = new Department();
      const project = new Project();
      const developer1 = new Developer();
      const developer2 = new Developer();
      const developer3 = new Developer();
      developer2.startProject(project);
      developer1.skill = 1;
      developer3.skill = 5;
      department.developers.push(developer1, developer2, developer3);

      department.firedDevelopers();

      expect(department.developers.length).toBe(2);
      expect(department.developers).toEqual([developer2, developer3]);
      expect(department.statisticFiredDevelopers).toBe(1);
    });

    test("shouldn't fire anyone", () => {
      const department = new Department();
      const project = new Project();
      const developer1 = new Developer();
      const developer2 = new Developer();
      const developer3 = new Developer();
      developer1.startProject(project);
      developer2.startProject(project);
      developer3.startProject(project);
      department.developers.push(developer1, developer2, developer3);

      department.firedDevelopers();

      expect(department.developers.length).toBe(3);
      expect(department.developers).toEqual([
        developer1,
        developer2,
        developer3
      ]);
      expect(department.statisticFiredDevelopers).toBe(0);
    });
  });
});
