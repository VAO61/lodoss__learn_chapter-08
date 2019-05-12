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
    this.projects.forEach(project => {
      const developer = this.unBusyDevelopers.pop();

      // Если есть незанятые
      if (!developer) {
        return;
      }

      // Передаем проект разработчику
      developer.startProject(project);

      // убираем разработчика из сиписка не занятых
      this.unBusyDevelopers = this.unBusyDevelopers.filter(
        d => d !== developer
      );
      // Переводим разработчика из списка незанятых в занятые
      this.developers.push(developer);
    });

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

    this.developers.forEach(function(developer) {
      developer.work();
    });

    this.unBusyDevelopers.forEach(function(developer) {
      developer.work();
    });

    this.projects
      .filter(
        project => project.progress >= project.difficulty
      ) /* Массив проектов, над которыми завершена работа */
      .forEach(project => {
        project.progress = 0;
        project.difficulty = 1;

        const developers = this.developers.filter(
          developer => developer.project === project
        );
        developers.forEach(developer => {
          // Говорим разработичку остановить работу над проектом (об`Null`яем проект и повышаем skill на 1)
          developer.stopProject();
          // Убираем разаработчика из массива занятых
          this.developers = this.developers.filter(d => d !== developer);
          // Переводим разработчика в массив незанятых
          this.unBusyDevelopers.push(developer);
        });

        // Удаляем проект из списка проектов "в работе"
        this.projects = this.projects.filter(p => p !== project);
        // Добавляем проект в массив завершенных проектов отдела
        this.doneProjects.push(project);
      });
  }
}

module.exports = MobileDept;
