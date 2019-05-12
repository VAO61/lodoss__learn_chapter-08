const Department = require('./Department.js');

class MobileDept extends Department {
  constructor() {
    super();
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

module.exports = MobileDept;
