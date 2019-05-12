const WebDept = require('./department/WebDept.js');
const MobileDept = require('./department/MobileDept.js');
const TestDept = require('./department/TestDept.js');

const WebProject = require('./projects/WebProject.js');
const MobileProject = require('./projects/MobileProject.js');
// Не используются пока
// const TestProject = require('./projects/TestProject.js');

const WebDeveloper = require('./developers/WebDeveloper.js');
const MobileDeveloper = require('./developers/MobileDeveloper.js');
const TestDeveloper = require('./developers/TestDeveloper.js');

class Manager {
  constructor() {
    this.webDept = new WebDept();
    this.mobileDept = new MobileDept();
    this.testDept = new TestDept();
    this.pendingProjects = []; // ожидающие принятия проекты
    this.devDoneProjects = [];
    this.doneProjects = [];
    // TODO: использовать первичные и вторичные данные, и фильтр
    // this.firedDevelopers = [];
    this.statisticHiredDevelopers = 0;
    // this.statisticFiredDevelopers = 0;
  }

  hiredDevelopers(developers) {
    // TODO: пофиксить зависимость с hiredDevelopers и необходимым кол-вом
    // найм сотрудников
    this.pendingProjects.forEach(project => {
      if (project instanceof WebProject) {
        this.webDept.addDeveloper(new WebDeveloper());
      } else if (project instanceof MobileProject) {
        this.mobileDept.addDeveloper(new MobileDeveloper());
      }
    });
    this.devDoneProjects.forEach(() => {
      this.testDept.addDeveloper(new TestDeveloper());
    });

    // TODO: не по одному, а в зависимости от кол-ва поступивших вчера проектов
    developers.forEach(developer => {
      if (developer instanceof WebDeveloper) {
        this.webDept.addDeveloper(developer);
      } else if (developer instanceof MobileDeveloper) {
        this.mobileDept.addDeveloper(developer);
      } else if (developer instanceof TestDeveloper) {
        this.testDept.addDeveloper(developer);
      }
    });
  }

  generatePendingProjects(projects) {
    // добавление проектов от заказчика в массив невыполненных проектов у директора (склад проектов директора)
    this.pendingProjects.push(...projects);
  }

  generateStatisticHiredDevelopers() {
    this.statisticHiredDevelopers +=
      this.pendingProjects.length + this.devDoneProjects.length;
  }

  addProjects() {
    const arr = this.pendingProjects.sort(
      (a, b) => a.difficulty - b.difficulty
    );
    // распихиваем проекты со склада по отделам мобильной и веб разработок
    while (arr.length > 0) {
      const project = arr.pop();
      // забираем проекты из отсортированного массива по одному

      this.pendingProjects.forEach(project => {
        if (
          project instanceof WebProject &&
          project.difficulty <= this.webDept.getSafeLoad()
        ) {
          // this.webDept.addProjects([project]);
        } else if (
          project instanceof MobileProject &&
          project.difficulty <= this.mobileDept.getSafeLoad()
        ) {
          // this.mobileDept.addProjects([project]);
        }
      });
    }

    // наводим порядок на складе
    // this.pendingProjects = this.pendingProjects.filter((project) => {
    //   return project !== null;
    // });

    // забираем готовые проекты у отделов веб и мобильной разработки, и передаем их тестировщикам
    this.transferToTestDeptProjects();

    // приказ работать всем отделам
    this.webDept.work();
    this.mobileDept.work();
    this.testDept.work();
  }

  transferToTestDeptProjects() {
    this.devDoneProjects.push(
      ...this.webDept.takeDevDonProjectsTransfer(),
      ...this.mobileDept.takeDevDonProjectsTransfer()
    );

    this.testDept.addProjects(this.devDoneProjects);
    this.devDoneProjects.forEach((project, index) => {
      if (this.testDept.getSafeLoad() > 0) {
        this.testDept.addProjects([project]);
        this.devDoneProjects[index] = null;
      }
    });

    this.devDoneProjects = this.devDoneProjects.filter(function(project) {
      return project !== null;
    });

    this.doneProjects.push(...this.testDept.takeDevDonProjectsTransfer());
  }
}

module.exports = Manager;
