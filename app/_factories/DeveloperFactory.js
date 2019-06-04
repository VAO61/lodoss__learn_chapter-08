const MobileDeveloper = require('../developers/MobileDeveloper.js');

const DeveloperFactory = {
  createMobileDeveloper() {
    return new MobileDeveloper();
  }
};

module.exports = DeveloperFactory;
