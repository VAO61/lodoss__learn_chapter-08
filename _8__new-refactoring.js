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
      projects.push(new WebProject(this.getRandom(1, 3)));
    }
    for (let i = 0; i < countProjects - webProjects; i++) {
      projects.push(new MobileProject(this.getRandom(1, 3)));
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
    this.webDept = new WebDept();
    this.mobileDept = new MobileDept();
    this.testDept = new TestDept();
    this.pendingProjects = []; // ожидающие принятия проекты
    this.devDoneProjects = [];
    this.devDonProjectsTransfer = [];
    this.doneProjects = [];
    // // TODO: использовать первичные и вторичные данные, и фильтр
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
    this.devDonProjectsTransfer.forEach(() => {
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
    this.statisticHiredDevelopers += this.pendingProjects.length + this.devDonProjectsTransfer.length;
  }

  addProjects() {
    const arr = this.pendingProjects.sort((a, b) => a.difficulty - b.difficulty);
    // распихиваем проекты со склада по отделам мобильной и веб разработок
    while (arr.length > 0) {
      const project = arr.pop();
      // забираем проекты из отсортированного массива по одному

      this.pendingProjects.forEach((project) => {
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
    });

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
    // TODO: врядли теперь нужно описание свойства специализации
    this.projects = [];
    this.developers = [];
    this.unBusyDevelopers = [];
    this.doneProjects = [];
  }

  firedDevelopers() {
    let developer = this.getUnBusyDeveloper();
    if (developer !== undefined) {
      this.firedDeveloper(developer);
      this.statisticFiredDevelopers++;
    }

    // увольняем лишних сотрудников
    // TODO: объединить в один firedDeveloper
    // let developer = this.webDept.getUnBusyDeveloper();
    // if (developer !== undefined) {
    //   this.webDept.firedDeveloper(this.webDept.getUnBusyDeveloper());
    //   this.statisticFiredDevelopers++;
    // }

    // developer = this.mobileDept.getUnBusyDeveloper();
    // if (developer !== undefined) {
    //   this.mobileDept.firedDeveloper(this.mobileDept.getUnBusyDeveloper());
    //   this.statisticFiredDevelopers++;
    // }

    // developer = this.testDept.getUnBusyDeveloper();
    // if (developer !== undefined) {
    //   this.testDept.firedDeveloper(this.testDept.getUnBusyDeveloper());
    //   this.statisticFiredDevelopers++;
    // }
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
  getSafeLoad(department) {
    // TODO[important]: ПРОВЕРИТЬ!
    if (department instanceof MobileDept) {
      let sum = 0;
      for (let i = 0; i < this.projects.length; i++) {
        sum += this.projects[i].difficulty;
      }
      return this.unBusyDevelopers.length - sum;
    } else if (
      department instanceof WebDept ||
      department instanceof TestDept
    ) {
      return this.unBusyDevelopers.length - this.projects.length;
    }

    return 0;
  }

  takeDevDonProjectsTransfer() {
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

class WebDept extends Department {
  constructor() {
    super();
  }
}

class MobileDept extends Department {
  constructor() {
    super();
  }
}

class TestDept extends Department {
  constructor() {
    super();
  }
}

class Project {
  constructor(type, difficulty) {
    this.type = type;
    this.difficulty = difficulty;
    this.progress = 0;
  }
}

class WebProject extends Project {
  constructor() {
    super();
  }
}

class MobilProject extends Project {
  constructor() {
    super();
  }
}

class TestProject extends Project {
  constructor() {
    super();
  }
}

class Developer {
  constructor(specialization) {
    this.specialization = specialization;
    this.skill = 0;
    this.project = null;
    this.unBusyCount = 0;
    // this.webDeveloper = new WebDeveloper();
    // this.mobileDeveloper = new MobileDeveloper();
    // this.testDeveloper = new TestDept();
  }

  // work() {
  //   this.project.progress++;
  // }
}

class WebDeveloper extends Developer {
  constructor() {
    super();
  }
}

class MobileDeveloper extends Developer {
  constructor() {
    super();
  }
}

class TestDeveloper extends Developer {
  constructor() {
    super();
  }
}

// const manager = new Manager();
// const incomingData = new IncomingData(manager, 20);
// incomingData.start();
// incomingData.statistic();
