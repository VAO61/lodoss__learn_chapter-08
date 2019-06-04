const DepartmentFactory = require('./_factories/DepartmentFactory.js');

const WebProject = require('./projects/WebProject.js');
const MobileProject = require('./projects/MobileProject.js');
// Не используются пока
// const TestProject = require('./projects/TestProject.js');

// const WebDeveloper = require('./developers/WebDeveloper.js');
// const MobileDeveloper = require('./developers/MobileDeveloper.js');
// const TestDeveloper = require('./developers/TestDeveloper.js');

class Manager {
  constructor() {
    this.webDept = DepartmentFactory.createWebDept();
    this.mobileDept = DepartmentFactory.createMobileDept();
    this.testDept = DepartmentFactory.createTestDept();
    this.pendingProjects = []; // ожидающие принятия проекты
    this.devDoneProjects = [];
    this.doneProjects = [];
    this.statisticHiredDevelopers = 0;
  }

  hiredDevelopers() {
    // Найм сотрудников. Минимум один разработчик на один проект
    this.pendingProjects.forEach(project => {
      if (project instanceof WebProject) {
        this.webDept.hiredDevelopers();
        this.statisticHiredDevelopers++;
      } else if (project instanceof MobileProject) {
        this.mobileDept.hiredDevelopers();
        this.statisticHiredDevelopers++;
      }
    });

    this.devDoneProjects.forEach(() => {
      this.testDept.hiredDevelopers();
      this.statisticHiredDevelopers++;
    });
  }

  generatePendingProjects(projects) {
    // добавление проектов от заказчика в массив невыполненных проектов у директора (склад проектов директора)
    this.pendingProjects.push(...projects);
  }

  addProjects(projects) {
    this.generatePendingProjects(projects);
  }

  work() {
    // Выполняется функция найма сотрудников
    this.hiredDevelopers();

    // Без временного массива не обойтись для решения поставленной ментором задачи (while + .sort + .pop) без потери проектов, не попавших в разработку
    const tmp = [];

    // распихиваем проекты со склада по отделам мобильной и веб разработок
    this.pendingProjects.sort((a, b) => a.difficulty - b.difficulty);

    while (this.pendingProjects.length > 0) {
      // Забираем проекты из отсортированного массива по одному
      const project = this.pendingProjects.pop();
      if (
        project instanceof WebProject &&
        project.difficulty <= this.webDept.getSafeLoad()
      ) {
        this.webDept.projects.push(project);
      } else if (
        project instanceof MobileProject &&
        project.difficulty <= this.mobileDept.getSafeLoad()
      ) {
        this.mobileDept.projects.push(project);
      } else {
        // Пушим во временное хранилище чтобы не потерять проект и отдать его в след. итерацию
        tmp.push(project);
      }
    }
    // Обновляем массив проектов для реализации в последующий день
    this.pendingProjects.push(...tmp);

    // забираем готовые проекты у отделов веб и мобильной разработки, и передаем их тестировщикам
    this.transferToTestDeptProjects();

    // забирает у отдела тестирования заерщенные проекты и скадируем в список завершенных
    this.getCompletedProjects();

    // приказ работать всем отделам
    this.webDept.work();
    this.mobileDept.work();
    this.testDept.work();

    // приказ увольнять сотрудников
    this.webDept.firedDevelopers();
    this.mobileDept.firedDevelopers();
    this.testDept.firedDevelopers();
  }

  /**
   * Забирает у отделов Web и Mobile завершенные проекты, и отдает их по возможности в отдел тестирования
   */
  transferToTestDeptProjects() {
    this.devDoneProjects.push(
      ...this.webDept.takeDevDonProjectsTransfer(),
      ...this.mobileDept.takeDevDonProjectsTransfer()
    );

    const tmp = [];
    while (this.devDoneProjects.length > 0) {
      const project = this.devDoneProjects.pop();

      if (this.testDept.getSafeLoad() > 0) {
        this.testDept.projects.push(project);
      } else {
        tmp.push(project);
      }
    }
    this.devDoneProjects.push(...tmp);
  }

  getCompletedProjects() {
    // забирает у отдела тестирования заерщенные проекты и скадируем в список завершенных
    this.doneProjects.push(...this.testDept.takeDevDonProjectsTransfer());
  }
}

module.exports = Manager;
