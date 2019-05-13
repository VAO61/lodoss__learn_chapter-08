class Department {
  constructor() {
    // TODO: требуется рефакторинг массивов, должно остаться два
    this.projects = [];
    this.developers = [];
    this.unBusyDevelopers = [];
    this.doneProjects = [];
    this.statisticFiredDevelopers = 0;
  }

  firedDevelopers() {
    let developer = this.getUnBusyDeveloper();
    if (developer !== undefined) {
      this.unBusyDevelopers = this.unBusyDevelopers.filter(item => {
        return item !== developer;
      });
      this.statisticFiredDevelopers++;
    }
  }

  getSafeLoad() {
    return this.unBusyDevelopers.length - this.projects.length;
  }

  takeDevDonProjectsTransfer() {
    const clone = [...this.doneProjects];
    this.doneProjects = [];
    return clone;
  }

  getUnBusyDeveloper() {
    const array = this.unBusyDevelopers
      .filter(developer => {
        return developer.unBusyCount >= 3;
      })
      .sort((developer1, developer2) => {
        return developer2.developerSkill - developer1.developerSkill;
      });

    return array.pop();
  }

  workF1() {
    this.projects.forEach(project => {
      const developer = this.unBusyDevelopers.pop();

      // Если есть незанятые
      if (!developer) {
        return;
      }

      // Передаем проект разработчику
      developer.startProject(project);

      // Убираем разработчика из массива незанятых
      this.unBusyDevelopers = this.unBusyDevelopers.filter(
        d => d !== developer
      );
      // Переводим разработчика из массива незанятых в массив занятых
      this.developers.push(developer);
    });
  }

  workF2() {
    this.developers.forEach(function(developer) {
      developer.work();
    });

    this.unBusyDevelopers.forEach(function(developer) {
      developer.work();
    });
  }

  workF3() {
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

  work() {
    this.workF1();
    this.workF2();
    this.workF3();
  }
}

module.exports = Department;
