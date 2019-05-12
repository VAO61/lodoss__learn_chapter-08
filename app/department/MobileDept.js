const Department = require('./Department.js');

class MobileDept extends Department {
  constructor() {
    super();
  }

  /**
   * Расчитывает допустимую нагрузку на отдел
   */
  getSafeLoad() {
    let sum = 0;
    for (let i = 0; i < this.projects.length; i++) {
      sum += this.projects[i].difficulty;
    }
    return this.unBusyDevelopers.length - sum;
  }

  work() {
    this.workF1();

    // Дополнительные разработчики на проект (этот кусок кода специфичен для отдела мобильной разработки)
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
    this.unBusyDevelopers = this.unBusyDevelopers.filter(
      developer => developer !== null
    );

    this.workF2();
    this.workF3();
  }
}

module.exports = MobileDept;
