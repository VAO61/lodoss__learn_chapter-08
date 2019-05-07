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
  // transferProjects() {
  //   this.manager.addProjects(this.generateProjects());
  // }
  // start() {
  //   for (let i = 0; i < this.days; i++) {
  //     this.transferProjects();
  //   }
  // }
  // statistic() {
  //   console.log('Статистика:');
  //   console.log(`Выполненных проектов: ${this.manager.doneProjects.length}`);
  //   console.log(
  //     `Нанятых сотрудников: ${this.manager.statisticHiredDevelopers}`
  //   );
  //   console.log(
  //     `Уволенных сотрудников: ${this.manager.statisticFiredDevelopers}`
  //   );
  // }
}

class Manager {
  constructor() {
    this.webDept = new WebDept();
    this.mobileDept = new MobileDept();
    this.testDept = new TestDept();
    // this.webDeveloper = new WebDeveloper();
    // this.mobileDeveloper = new MobileDeveloper();
    // this.testDeveloper = new TestDeveloper();
    // this.devDoneProjects = [];
    // this.devDonProjectsTransfer = [];
    // this.doneProjects = [];
    this.pendingProjects = []; // ожидающие принятия проекты
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

  getPendingProjects(projects) {
    // добавление проектов от заказчика в массив невыполненных проектов у директора (склад проектов директора)
    this.pendingProjects.push(...projects);
  }

  getStatisticHiredDevelopers() {
    this.statisticHiredDevelopers += this.pendingProjects.length + this.devDonProjectsTransfer.length;
  }

  addProjects() {
    

    // распихиваем проекты со склада по отделам мобильной и веб разработок
    // TODO: воспользоваться сортировкой arr.sort(), методом arr.pop() и циклом while () {...}
    while (/*pendingProjects.length > 0*/) { // не точно, пока не останется свободных рук
      // можно перенести в Department и просуммировать допустимую нагрузку
      this.pendingProjects.forEach((project) => {
        if (
          project instanceof WebProject &&
          project.difficulty <= this.webDept.getSafeLoad()
        ) {
          // this.webDept.addProjects([project]);
          // this.pendingProjects[index] = null;
        } else if (
          project instanceof MobileProject &&
          project.difficulty <= this.mobileDept.getSafeLoad()
        ) {
          // this.mobileDept.addProjects([project]);
          // this.pendingProjects[index] = null;
        }
      });
    });

    // наводим порядок на складе
    this.pendingProjects = this.pendingProjects.filter((project) => {
      return project !== null;
    });

    // забираем готовые проекты у отделов веб и мобильной разработки и передаем их тестировщикам
    this.transferToTestDeptProjects();

    // приказ работать всем отделам
    this.webDept.work();
    this.mobileDept.work();
    this.testDept.work();
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
