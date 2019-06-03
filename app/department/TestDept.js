const Department = require('./Department.js');
const TestDeveloper = require('../developers/TestDeveloper.js');

class TestDept extends Department {
  constructor() {
    super();
  }

  hiredDevelopers() {
    this.developers.push(new TestDeveloper());
  }
}

module.exports = TestDept;
