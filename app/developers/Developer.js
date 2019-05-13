class Developer {
  constructor() {
    this.skill = 0;
    this.project = null;
    this.unBusyCount = 0;
    // this.webDeveloper = new WebDeveloper();
    // this.mobileDeveloper = new MobileDeveloper();
    // this.testDeveloper = new TestDept();
  }

  startProject(project) {
    // TODO: должно быть свойством (одним если они взаимозаменяемы) класса Developer
    // UPD: это разные сущности
    // Назначаем проект разработчику
    this.project = project;
    // Обнуляем счетчик дней простоя разработчика
    this.unBusyCount = 0;
  }

  stopProject() {
    this.project = null;
    this.skill++;
  }

  work() {
    if (this.project !== null) {
      // Увеличиваем прогресс выполнения проекта
      this.project.progress++;
    } else {
      // Увеличиваем простой на 1 (день) если сотруднику не назначен проект
      this.unBusyCount++;
    }
  }
}

module.exports = Developer;
