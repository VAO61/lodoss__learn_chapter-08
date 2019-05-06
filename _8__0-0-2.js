const TYPE_PROJECT_WEB = 'Web';
const TYPE_PROJECT_MOBILE = 'Mobile';

const SPECIALIZATION_WEB = 'Web';
const SPECIALIZATION_MOBILE = 'Mobile';
const SPECIALIZATION_TEST = 'Test';

class IncomingData {
  constructor(manager, days) {
    this.manager = manager;
    this.days = days;
  }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateProjects() {
    const countProjects = this.getRandom(0, 4);
    const webProjects = this.getRandom(0, countProjects);
    const projects = [];

    for (let i = 0; i < webProjects; i++) {
      projects.push(new Project(TYPE_PROJECT_WEB, this.getRandom(1, 3)));
    }

    for (let i = 0; i < countProjects - webProjects; i++) {
      projects.push(new Project(TYPE_PROJECT_MOBILE, this.getRandom(1, 3)));
    }

    return projects;
  }

  transferProjects() {
    this.manager.addProjects(this.generateProjects());
  }

  start() {
    for (let i = 0; i < this.days; i++) {
      this.transferProjects();
    }
  }

  statistic() {
    console.log('Статистика:');
    console.log(`Выполненных проектов: ${this.manager.doneProjects.length}`);
    console.log(
      `Нанятых сотрудников: ${this.manager.statisticHiredDevelopers}`
    );
    console.log(
      `Уволенных сотрудников: ${this.manager.statisticFiredDevelopers}`
    );
  }
}

class Manager {
  constructor() {
    // TODO: переписать на instanceof
    this.webDept = new Department(SPECIALIZATION_WEB); // Полиморфизм, по факту - фабрика
    this.mobileDept = new Department(SPECIALIZATION_MOBILE); // Полиморфизм, по факту - фабрика
    this.testDept = new Department(SPECIALIZATION_TEST); // Полиморфизм, по факту - фабрика
    // От конкретной сущности Department, но не от метода фабрики
    // const webDept = Department.createWebDept ();
    // После описания класса Department
    // Добавление кода без изменения старого - удобная расширяемость
    this.devDoneProjects = [];
    this.devDonProjectsTransfer = [];
    this.doneProjects = [];
    this.pendingProjects = []; // ожидающие принятия проекты
    // TODO: использовать первичные и вторичные данные, и фильтр
    this.firedDevelopers = [];
    this.statisticHiredDevelopers = 0;
    this.statisticFiredDevelopers = 0;
  }

  hiredDevelopers(developers) {
    // TODO: не по одному, а в зависимости от кол-ва вчерашних проектов (наверное не здесь имелось в виду)
    developers.forEach(function(developer) {
      if (developer.developerType == SPECIALIZATION_WEB) {
        this.webDept.addDeveloper(developer);
      } else if (developer.developerType == SPECIALIZATION_MOBILE) {
        this.mobileDept.addDeveloper(developer);
      } else if (developer.developerType == SPECIALIZATION_TEST) {
        this.testDept.addDeveloper(developer);
      }
    });
  }

  firedDevelopers() {
    // TODO: отвязать и вынести. Manager должен только увольнять
    // TODO: * объединить в один firedDeveloper * Это уже новый объект, объединяющий упомопянутые (?)
    let developer = this.webDept.getUnBusyDeveloper();
    if (developer) {
      this.webDept.firedDeveloper(developer);
    }

    developer = this.mobileDept.getUnBusyDeveloper();
    if (developer) {
      this.mobileDept.firedDeveloper(developer);
    }

    developer = this.testDept.getUnBusyDeveloper();
    if (developer) {
      this.testDept.firedDeveloper(developer);
    }
  }

  addProjects(projects) {
    this.statisticHiredDevelopers +=
      this.pendingProjects.length + this.devDonProjectsTransfer.length;
    // TODO ...
    // найм сотрудников
    this.pendingProjects.forEach(project => {
      if (project.type === TYPE_PROJECT_WEB) {
        this.webDept.addDeveloper(new Developer(SPECIALIZATION_WEB));
      } else if (project.type === TYPE_PROJECT_MOBILE) {
        this.mobileDept.addDeveloper(new Developer(SPECIALIZATION_MOBILE));
      }
    });

    this.devDonProjectsTransfer.forEach(() => {
      this.testDept.addDeveloper(new Developer(SPECIALIZATION_TEST));
    });

    // добавление проектов от заказчика в массив невыполненных проектов у директора (склад проектов директора)
    this.pendingProjects.push(...projects);

    // распихиваем проекты со склада по отделам мобильной и веб разработок
    // TODO: воспользоваться сортировкой arr.sort(), методом arr.pop() и циклом while () {...}
    this.pendingProjects.forEach((project, index) => {
      if (
        project.type === TYPE_PROJECT_WEB &&
        project.difficulty <= this.webDept.getSafeLoad()
      ) {
        this.webDept.addProjects([project]);
        this.pendingProjects[index] = null;
      } else if (
        project.type === TYPE_PROJECT_MOBILE &&
        project.difficulty <= this.mobileDept.getSafeLoad()
      ) {
        this.mobileDept.addProjects([project]);
        this.pendingProjects[index] = null;
      }
    });

    // наводим порядок на складе
    this.pendingProjects = this.pendingProjects.filter(function(project) {
      return project !== null;
    });

    // забираем готовые проекты у отделов веб и мобильной разработки и передаем их тестировщикам
    this.transferToTestDeptProjects();

    // приказ работать всем отделам
    this.webDept.work();
    this.mobileDept.work();
    this.testDept.work();

    // увольняем лишних сотрудников
    // TODO: объединить в один firedDeveloper
    let developer = this.webDept.getUnBusyDeveloper();
    if (developer !== undefined) {
      this.webDept.firedDeveloper(this.webDept.getUnBusyDeveloper());
      this.statisticFiredDevelopers++;
    }

    developer = this.mobileDept.getUnBusyDeveloper();
    if (developer !== undefined) {
      this.mobileDept.firedDeveloper(this.mobileDept.getUnBusyDeveloper());
      this.statisticFiredDevelopers++;
    }

    developer = this.testDept.getUnBusyDeveloper();
    if (developer !== undefined) {
      this.testDept.firedDeveloper(this.testDept.getUnBusyDeveloper());
      this.statisticFiredDevelopers++;
    }
  }

  transferToTestDeptProjects() {
    this.devDonProjectsTransfer.push(
      ...this.webDept.getDevDonProjectsTransfer(),
      ...this.mobileDept.getDevDonProjectsTransfer()
    );

    this.testDept.addProjects(this.devDonProjectsTransfer);
    this.devDonProjectsTransfer.forEach((project, index) => {
      if (this.testDept.getSafeLoad() > 0) {
        this.testDept.addProjects([project]);
        this.devDonProjectsTransfer[index] = null;
      }
    });

    this.devDonProjectsTransfer = this.devDonProjectsTransfer.filter(function(
      project
    ) {
      return project !== null;
    });

    this.doneProjects.push(...this.testDept.getDevDonProjectsTransfer());
  }
}

class Department {
  constructor(spec) {
    this.spec = spec;
    this.projects = [];
    this.developers = [];
    this.unBusyDevelopers = [];
    this.doneProjects = [];
  }

  addDeveloper(developer) {
    this.unBusyDevelopers.push(developer);
  }

  addProjects(projects) {
    this.projects.push(...projects);
  }

  /**
   * Расчитывает допустимую нагрузку на отдел
   */
  // TODO: вынести и объединить в классе Department getSafeload (?)
  getSafeLoad() {
    if (this.spec === SPECIALIZATION_MOBILE) {
      let sum = 0;
      for (let i = 0; i < this.projects.length; i++) {
        sum += this.projects[i].difficulty;
      }
      return this.unBusyDevelopers.length - sum;
    } else if (
      this.spec === SPECIALIZATION_WEB ||
      this.spec === SPECIALIZATION_TEST
    ) {
      return this.unBusyDevelopers.length - this.projects.length;
    }

    return 0;
  }

  takeDevDonProjectsTransfer() {
    // was 'get...'
    const clone = [...this.doneProjects];
    this.doneProjects = [];
    return clone;
  }

  getUnBusyDeveloper() {
    const array = this.unBusyDevelopers
      .filter(developer => {
        return developer.developerUnBusy >= 3;
      })
      .sort((developer1, developer2) => {
        return developer2.developerSkill - developer1.developerSkill;
      });

    return array.pop();
  }

  // TODO: объединить в один firedDeveloper
  firedDeveloper(developer) {
    this.unBusyDevelopers = this.unBusyDevelopers.filter(item => {
      return item !== developer;
    });
  }

  work() {
    this.projects.forEach(project => {
      const developer = this.unBusyDevelopers.pop();
      if (!developer) {
        return;
      }
      // TODO: должно быть свойством (одним если они взаимозаменяемы) класса Developer
      developer.project = project;
      developer.developerUnBusy = 0;
      this.developers.push(developer);
    });

    if (this.spec === SPECIALIZATION_MOBILE) {
      this.unBusyDevelopers.forEach((developer, index) => {
        this.projects.forEach(project => {
          const count = this.developers.filter(function(item) {
            return item.project === project;
          }).length;

          if (project.difficulty > count) {
            developer.project = project;
            developer.developerUnBusy = 0;
            this.developers.push(developer);
            this.unBusyDevelopers[index] = null;
          }
        });
      });

      this.unBusyDevelopers = this.unBusyDevelopers.filter(function(developer) {
        return developer !== null;
      });
    }
    // TODO _start: в зависимость от наличия проектов, объединить и перенести в класс Developer
    this.developers.forEach(function(developer) {
      developer.work();
    });

    // всем неработавшим сотрудникам увеличили простой на 1
    this.unBusyDevelopers.forEach(developer => {
      developer.developerUnBusy++;
    });
    // TODO _end: в зависимость от наличия проектов, объединить и перенести в класс Developer

    this.projects.forEach((project, index) => {
      // TODO: переделать на filter(fuction(){})
      if (project.progress >= project.difficulty) {
        // перед тем как отдать проект тестировщикам обнулим прогресс выполнения и уменьшаем сложность до 1
        project.progress = 0;
        project.difficulty = 1;
        this.doneProjects.push(project);
        this.projects[index] = null;

        const developers = this.developers.filter(developer => {
          return developer.project === project;
        });

        developers.forEach(developer => {
          developer.developerSkill++;
          this.developers = this.developers.filter(item => {
            return item !== developer;
          });
          this.unBusyDevelopers.push(developer);
        });
      }
    });

    this.projects = this.projects.filter(function(project) {
      return project !== null;
    });
  }
}
// Подклассы:

// class ParentClass {
//   constructor() {
//     ...
//   }
// }

// NewClass = Object.create(ParentClass) {};
// NewClass.prototype = new ParentClass();
// class NewClass extends ParentClass {};

class WebDept extends Department {
  // constructor () {
  // this. ...this;
  // }
  // Необходимо для вызова функций, принадлежащих родителю объекта
  // super(свойства, конструктора, родителя);
}
class MobileDept extends Department {}
class TestDept extends Department {}

class Project {
  constructor(type, difficulty) {
    this.type = type;
    this.difficulty = difficulty;
    this.progress = 0;
  }
}

class WebProject extends Project {}
class MobilProject extends Project {}
class TestProject extends Project {}

class Developer {
  constructor(developerType) {
    this.developerType = developerType;
    this.developerSkill = 0;
    this.project = null;
    this.developerUnBusy = 0;
  }

  work() {
    this.project.progress++;
  }
}

class WebDeveloper extends Developer {}
class MobileDeveloper extends Developer {}
class TestDeveloper extends Developer {}

const manager = new Manager();
const incomingData = new IncomingData(manager, 20);
incomingData.start();
incomingData.statistic();
