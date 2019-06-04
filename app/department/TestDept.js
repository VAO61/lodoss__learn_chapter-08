const DeveloperFactory = require('../_factories/DeveloperFactory.js');
const Department = require('./Department.js');

class TestDept extends Department {
  constructor() {
    super();
  }

  hiredDevelopers() {
    this.developers.push(DeveloperFactory.createTestDeveloper());
  }
}

module.exports = TestDept;
