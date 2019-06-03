const Department = require('./Department.js');
const WebDeveloper = require('../developers/WebDeveloper.js');

class WebDept extends Department {
  constructor() {
    super();
  }

  hiredDevelopers() {
    this.developers.push(new WebDeveloper());
  }
}

module.exports = WebDept;
