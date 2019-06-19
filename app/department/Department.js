class Department {
  constructor() {
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

  /**
   * Возвращает список проектов, над которыми работа еще не начата
   */
  getNotStartProjects() {
    return this.projects.filter(project => {
      return !this.developers.some(developer => developer.project === project);
    });
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

  /**
   * Назначает минимум одного разработчика на один проект
   */
  workAssign() {
    const unBusyDevelopers = this.getUnBusyDevelopers();
    const notStartProjects = this.getNotStartProjects();
    while (notStartProjects.length && unBusyDevelopers.length) {
      const project = notStartProjects.pop();
      const developer = unBusyDevelopers.pop();
      developer.startProject(project);
    }
  }

  /**
   * Приказывает каждому разработчику работать
   */
  workStart() {
    this.developers.forEach(developer => developer.work());
  }

  workEnd() {
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
    this.workAssign();
    this.workStart();
    this.workEnd();
    // console.log(this.statisticFiredDevelopers);
  }
}

module.exports = Department;
