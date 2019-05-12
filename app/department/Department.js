class Department {
  constructor() {
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

module.exports = Department;
