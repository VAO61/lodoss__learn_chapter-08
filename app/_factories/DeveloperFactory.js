const WebDeveloper = require('../developers/WebDeveloper.js');
const MobileDeveloper = require('../developers/MobileDeveloper.js');
const TestDeveloper = require('../developers/TestDeveloper.js');

const DeveloperFactory = {
  createMobileDeveloper() {
    return new MobileDeveloper();
  },
  createTestDeveloper() {
    return new TestDeveloper();
  },
  createWebDeveloper() {
    return new WebDeveloper();
  }
};

module.exports = DeveloperFactory;
