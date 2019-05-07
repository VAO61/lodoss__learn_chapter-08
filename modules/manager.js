module.exports = class Manager {
  constructor() {
    this.webDept = new Department(SPECIALIZATION_WEB); // Полиморфизм, по факту - фабрика
    this.mobileDept = new Department(SPECIALIZATION_MOBILE); // Полиморфизм, по факту - фабрика
    this.testDept = new Department(SPECIALIZATION_TEST); // Полиморфизм, по факту - фабрика
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
    while (pendingProjects.length > 0) {
      this.pendingProjects.sort(project => {});
    }

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
    // TODO: воспользоваться сортировкой arr.sort(), методом arr.pop() и циклом while () {...}

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
};
