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

  describe('method getNotStartProjects', () => {
    test('should receive only one pending to take in dev project (project3)', () => {
      const department = new Department();
      const developer1 = new Developer();
      const developer2 = new Developer();
      const developer3 = new Developer();
      const project1 = new Project();
      const project2 = new Project();
      const project3 = new Project();
      department.developers.push(developer1, developer2, developer3);
      department.projects.push(project1, project2, project3);
      developer1.project = project1;
      developer2.project = project1;
      developer3.project = project2;

      const unBusyDevelopers = department.getUnBusyDevelopers();
      const notStartProjects = department.getNotStartProjects();

      expect(unBusyDevelopers.length).toBe(0);
      expect(notStartProjects.length).toBe(1);
      expect(notStartProjects).toEqual([project3]);
    });

    test("shouldn't receive anyone project", () => {
      const department = new Department();
      const developer1 = new Developer();
      const developer2 = new Developer();
      const developer3 = new Developer();
      const project1 = new Project();
      const project2 = new Project();
      const project3 = new Project();
      department.developers.push(developer1, developer2, developer3);
      department.projects.push(project1, project2, project3);
      developer1.project = project1;
      developer2.project = project2;
      developer3.project = project3;

      const unBusyDevelopers = department.getUnBusyDevelopers();
      const notStartProjects = department.getNotStartProjects();

      expect(unBusyDevelopers.length).toBe(0);
      expect(notStartProjects.length).toBe(0);
    });
  });

  describe('method workAssign', () => {
    test('should assign project to unBusy developer (developer4)', () => {
      /**
       * Писать дополнительный тест для большего значения незанятых разработчиков, чем свободных проектов нецелесообразно.
       * Причина: логический оператор '&&' в условии назначения проекта
       */
      const department = new Department();
      const developer1 = new Developer();
      const developer2 = new Developer();
      const developer3 = new Developer();
      const developer4 = new Developer();
      const project1 = new Project();
      const project2 = new Project();
      const project3 = new Project();
      const project4 = new Project();
      department.developers.push(
        developer1,
        developer2,
        developer3,
        developer4
      );
      department.projects.push(project1, project2, project3, project4);
      // developer1.project = project1;
      developer1.startProject(project1);
      // developer2.project = project1;
      developer2.startProject(project2);
      // developer3.project = project2;
      developer3.startProject(project2);

      const unBusyDevelopers = department.getUnBusyDevelopers();
      const notStartProjects = department.getNotStartProjects();
      while (notStartProjects.length && unBusyDevelopers.length) {
        const project = notStartProjects.pop();
        const developer = unBusyDevelopers.pop();
        developer.startProject(project);
      }

      expect(unBusyDevelopers.length).toBe(0);
      expect(developer4.project !== null).toBe(true);
      expect(developer4.project).toEqual(project4);
      expect(notStartProjects.length).toBe(1);
    });

    test("shouldn't assign anyone project", () => {
      /**
       * Собственно, как и этот
       */
      const department = new Department();
      const developer1 = new Developer();
      const developer2 = new Developer();
      const project1 = new Project();
      const project2 = new Project();
      department.developers.push(developer1, developer2);
      department.projects.push(project1, project2);
      developer1.startProject(project1);
      developer2.startProject(project2);

      const unBusyDevelopers = department.getUnBusyDevelopers();
      const notStartProjects = department.getNotStartProjects();
      while (notStartProjects.length && unBusyDevelopers.length) {
        const project = notStartProjects.pop();
        const developer = unBusyDevelopers.pop();
        developer.startProject(project);
      }

      expect(unBusyDevelopers.length).toBe(0);
      expect(notStartProjects.length).toBe(0);
    });
  });
});
