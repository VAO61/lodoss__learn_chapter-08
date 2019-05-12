class Developer {
  constructor(specialization) {
    this.specialization = specialization;
    this.skill = 0;
    this.project = null;
    this.unBusyCount = 0;
    // this.webDeveloper = new WebDeveloper();
    // this.mobileDeveloper = new MobileDeveloper();
    // this.testDeveloper = new TestDept();
  }

  // work() {
  //   this.project.progress++;
  // }
}

module.exports = Developer;
