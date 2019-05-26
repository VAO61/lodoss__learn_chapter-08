class Department {
  constructor() {
    // TODO: требуется рефакторинг массивов, должно остаться два
    this.projects = [];
    this.developers = [];
    this.doneProjects = [];
    this.statisticFiredDevelopers = 0;
  }

  /**
   * Возвращает массив незаняты разработчиков
   */
  getUnBusyDevelopers() {
    return this.developers.filter(developer => !developer.isBusy());
  }

  firedDevelopers() {
    let developer = this.getUnBusyDeveloper();
    if (developer) {
      this.developers = this.developers.filter(item => {
        return item !== developer;
      });
      this.statisticFiredDevelopers++;
    }
  }

  hiredDevelopers() {
    // Генерация исключения
    throw new Error('Метод hiredDevelopers не переопределен');
  }

  getSafeLoad() {
    return this.getUnBusyDevelopers().length - this.projects.length;
  }

  takeDevDonProjectsTransfer() {
    const clone = [...this.doneProjects];
    this.doneProjects = [];
    return clone;
  }

  getUnBusyDeveloper() {
    const array = this.getUnBusyDevelopers().sort(
      (developer1, developer2) => developer2.skill - developer1.skill
    );

    return array.pop();
  }

  workF1() {
    // распределяет по проектам (мин. 1 на проект)
    // TODO: while!

    const unBusyDevelopers = this.getUnBusyDevelopers();
    this.projects.forEach(project => {
      const developer = unBusyDevelopers.pop();

      // Если есть незанятые
      if (!developer) {
        return;
      }

      // Передаем проект разработчику
      developer.startProject(project);
    });
  }

  workF2() {
    // Приступить к работе разработчикам в отделе
    this.developers.forEach(function(developer) {
      developer.work();
    });
  }

  workF3() {
    // Собирает готовые проекты
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
