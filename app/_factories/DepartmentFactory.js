const WebDept = require('../department/WebDept.js');
const MobileDept = require('../department/MobileDept.js');
const TestDept = require('../department/TestDept.js');

const DepartmentFactory = {
  createWebDept() {
    return new WebDept();
  },
  createMobileDept() {
    return new MobileDept();
  },
  createTestDept() {
    return new TestDept();
  }
};

module.exports = DepartmentFactory;
