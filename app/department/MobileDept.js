const Department = require('./Department.js');
const MobileDeveloper = require('../developers/MobileDeveloper.js');

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
    return this.getUnBusyDevelopers().length - sum;
  }

  hiredDevelopers() {
    this.developers.push(new MobileDeveloper());
  }

  work() {
    this.workF1();

    // Дополнительные разработчики на проект (этот кусок кода специфичен для отдела мобильной разработки)
    this.getUnBusyDevelopers().forEach(developer => {
      this.projects.forEach(project => {
        const count = this.developers.filter(function(item) {
          return item.project === project;
        }).length;

        if (project.difficulty > count) {
          developer.startProject(project);
        }
      });
    });

    this.workF2();
    this.workF3();
  }
}

module.exports = MobileDept;
