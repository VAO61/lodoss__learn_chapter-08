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
    let countProjects = this.getRandom(0, 4);
    let webProjects = this.getRandom(0, countProjects);
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
    this.webDept = new Department(SPECIALIZATION_WEB);
    this.mobileDept = new Department(SPECIALIZATION_MOBILE);
    this.testDept = new Department(SPECIALIZATION_TEST);
    this.devDoneProjects = [];
    this.devDonProjectsTransfer = [];
    this.doneProjects = [];
    this.pendingProjects = []; // ожидающие принятия проекты
    this.firedUnits = [];
    this.statisticHiredUnits = 0;
    this.statisticFiredUnits = 0;
  }

  hiredUnits(units) {
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
      ...this.webDept.getDevDonProjectsTransfer()
    );
    this.devDonProjectsTransfer.push(
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

  getDevDonProjectsTransfer() {
    // const clone = this.doneProjects.map(function(project) {
    //     return project
    // })

    const clone = [...this.doneProjects];
    this.doneProjects = [];
    return clone;
  }

  getUnBusyUnit() {
    const array = this.unBusyUnits
      .filter(function(unit) {
        return unit.unitUnBusy >= 3;
      })
      .sort(function(unit1, unit2) {
        return unit2.unitSkill - unit1.unitSkill;
      });

    return array.pop();
  }

  firedUnit(unit) {
    this.unBusyUnits = this.unBusyUnits.filter(function(item) {
      return item !== unit;
    });
  }

  work() {
    this.projects.forEach(project => {
      const unit = this.unBusyUnits.pop();
      if (!unit) {
        return;
      }
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

    this.units.forEach(function(unit) {
      unit.work();
    });

    // всем неработавшим сотрудникам увеличили простой на 1
    this.unBusyUnits.forEach(unit => {
      unit.unitUnBusy++;
    });

    this.projects.forEach((project, index) => {
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

class Project {
  constructor(type, difficulty) {
    this.type = type;
    this.difficulty = difficulty;
    this.progress = 0;
  }
}

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

const manager = new Manager();
const incomingData = new IncomingData(manager, 10);
incomingData.start();
incomingData.statistic();
