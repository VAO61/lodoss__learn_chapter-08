module.exports = class Developer {
  constructor(developerType) {
    this.developerType = developerType;
    this.developerSkill = 0;
    this.project = null;
    this.developerUnBusy = 0;
  }

  work() {
    this.project.progress++;
  }
};

class WebDeveloper extends Developer {}
class MobileDeveloper extends Developer {}
class TestDeveloper extends Developer {}
