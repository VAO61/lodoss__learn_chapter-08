const WebProject = require('./projects/WebProject.js');
const MobileProject = require('./projects/MobileProject.js');

class IncomingData {
  constructor(manager, days) {
    this.manager = manager;
    this.days = days;
  }
  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  generateProjects() {
    const countProjects = this.getRandom(0, 4);
    const webProjects = this.getRandom(0, countProjects);
    const projects = [];
    for (let i = 0; i < webProjects; i++) {
      projects.push(new WebProject(this.getRandom(1, 3)));
    }
    for (let i = 0; i < countProjects - webProjects; i++) {
      projects.push(new MobileProject(this.getRandom(1, 3)));
    }
    return projects;
  }
  transferProjects() {
    this.manager.addProjects(this.generateProjects());
  }
  start() {
    for (let i = 0; i < this.days; i++) {
      this.transferProjects();
    }
  }
  statistic() {
    console.log('Статистика:');
    console.log(`Выполненных проектов: ${this.manager.doneProjects.length}`);
    console.log(
      `Нанятых сотрудников: ${this.manager.statisticHiredDevelopers}`
    );
    console.log(
      `Уволенных сотрудников: ${this.manager.webDept.statisticFiredDevelopers +
        this.manager.mobileDept.statisticFiredDevelopers +
        this.manager.testDept.statisticFiredDevelopers}`
    );
  }
}

module.exports = IncomingData;
