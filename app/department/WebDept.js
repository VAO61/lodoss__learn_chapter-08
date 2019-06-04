const DeveloperFactory = require('../_factories/DeveloperFactory.js');
const Department = require('./Department.js');

class WebDept extends Department {
  constructor() {
    super();
  }

  hiredDevelopers() {
    this.developers.push(DeveloperFactory.createWebDeveloper());
  }
}

module.exports = WebDept;
