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
    console.log(`Нанятых сотрудников: ${this.manager.statisticHiredUnits}`);
    console.log(`Уволенных сотрудников: ${this.manager.statisticFiredUnits}`);
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
    this.firedUnits = [];
    this.statisticFiredUnits = 0;
  }

  hiredUnits(units) {
    // TODO: не по одному, а в зависимости от кол-ва вчерашних проектов (наверное не здесь имелось в виду)
    units.forEach(function(unit) {
      if (unit.unitType == SPECIALIZATION_WEB) {
        this.webDept.addUnit(unit);
      } else if (unit.unitType == SPECIALIZATION_MOBILE) {
        this.mobileDept.addUnit(unit);
      } else if (unit.unitType == SPECIALIZATION_TEST) {
        this.testDept.addUnit(unit);
      }
    });
  }

  firedUnits() {
    // TODO: отвязать и вынести. Manager должен только увольнять
    // TODO: * объединить в один firedUnit * Это уже новый объект, объединяющий упомопянутые (?)
    let unit = this.webDept.getUnBusyUnit();
    if (unit) {
      this.webDept.firedUnit(unit);
    }

    unit = this.mobileDept.getUnBusyUnit();
    if (unit) {
      this.mobileDept.firedUnit(unit);
    }

    unit = this.testDept.getUnBusyUnit();
    if (unit) {
      this.testDept.firedUnit(unit);
    }
  }

  addProjects(projects) {
    this.statisticHiredUnits +=
      this.pendingProjects.length + this.devDonProjectsTransfer.length;
    // TODO ...
    // найм сотрудников
    this.pendingProjects.forEach(project => {
      if (project.type === TYPE_PROJECT_WEB) {
        this.webDept.addUnit(new Unit(SPECIALIZATION_WEB));
      } else if (project.type === TYPE_PROJECT_MOBILE) {
        this.mobileDept.addUnit(new Unit(SPECIALIZATION_MOBILE));
      }
    });

    this.devDonProjectsTransfer.forEach(() => {
      this.testDept.addUnit(new Unit(SPECIALIZATION_TEST));
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
    // TODO: объединить в один firedUnit
    let unit = this.webDept.getUnBusyUnit();
    if (unit !== undefined) {
      this.webDept.firedUnit(this.webDept.getUnBusyUnit());
      this.statisticFiredUnits++;
    }

    unit = this.mobileDept.getUnBusyUnit();
    if (unit !== undefined) {
      this.mobileDept.firedUnit(this.mobileDept.getUnBusyUnit());
      this.statisticFiredUnits++;
    }

    unit = this.testDept.getUnBusyUnit();
    if (unit !== undefined) {
      this.testDept.firedUnit(this.testDept.getUnBusyUnit());
      this.statisticFiredUnits++;
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
    this.units = [];
    this.unBusyUnits = [];
    this.doneProjects = [];
  }

  addUnit(unit) {
    this.unBusyUnits.push(unit);
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
      return this.unBusyUnits.length - sum;
    } else if (
      this.spec === SPECIALIZATION_WEB ||
      this.spec === SPECIALIZATION_TEST
    ) {
      return this.unBusyUnits.length - this.projects.length;
    }

    return 0;
  }

  takeDevDonProjectsTransfer() {
    // was 'get...'
    const clone = [...this.doneProjects];
    this.doneProjects = [];
    return clone;
  }

  getUnBusyUnit() {
    const array = this.unBusyUnits
      .filter(unit => {
        return unit.unitUnBusy >= 3;
      })
      .sort((unit1, unit2) => {
        return unit2.unitSkill - unit1.unitSkill;
      });

    return array.pop();
  }

  // TODO: объединить в один firedUnit
  firedUnit(unit) {
    this.unBusyUnits = this.unBusyUnits.filter(item => {
      return item !== unit;
    });
  }

  work() {
    this.projects.forEach(project => {
      const unit = this.unBusyUnits.pop();
      if (!unit) {
        return;
      }
      // TODO: должно быть свойством (одним если они взаимозаменяемы) класса Unit
      unit.project = project;
      unit.unitUnBusy = 0;
      this.units.push(unit);
    });

    if (this.spec === SPECIALIZATION_MOBILE) {
      this.unBusyUnits.forEach((unit, index) => {
        this.projects.forEach(project => {
          const count = this.units.filter(function(item) {
            return item.project === project;
          }).length;

          if (project.difficulty > count) {
            unit.project = project;
            unit.unitUnBusy = 0;
            this.units.push(unit);
            this.unBusyUnits[index] = null;
          }
        });
      });

      this.unBusyUnits = this.unBusyUnits.filter(function(unit) {
        return unit !== null;
      });
    }
    // TODO _start: в зависимость от наличия проектов, объединить и перенести в класс Unit
    this.units.forEach(function(unit) {
      unit.work();
    });

    // всем неработавшим сотрудникам увеличили простой на 1
    this.unBusyUnits.forEach(unit => {
      unit.unitUnBusy++;
    });
    // TODO _end: в зависимость от наличия проектов, объединить и перенести в класс Unit

    this.projects.forEach((project, index) => {
      // TODO: переделать на filter(fuction(){})
      if (project.progress >= project.difficulty) {
        // перед тем как отдать проект тестировщикам обнулим прогресс выполнения и уменьшаем сложность до 1
        project.progress = 0;
        project.difficulty = 1;
        this.doneProjects.push(project);
        this.projects[index] = null;

        const units = this.units.filter(unit => {
          return unit.project === project;
        });

        units.forEach(unit => {
          unit.unitSkill++;
          this.units = this.units.filter(item => {
            return item !== unit;
          });
          this.unBusyUnits.push(unit);
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

class Unit {
  constructor(unitType) {
    this.unitType = unitType;
    this.unitSkill = 0;
    this.project = null;
    this.unitUnBusy = 0;
  }

  work() {
    this.project.progress++;
  }
}

class WebUnit extends Unit {}
class MobileUnit extends Unit {}
class TestUnit extends Unit {}

const manager = new Manager();
const incomingData = new IncomingData(manager, 20);
incomingData.start();
incomingData.statistic();
