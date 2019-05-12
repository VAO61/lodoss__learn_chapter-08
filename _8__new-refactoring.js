const Manager = require('./modules/manager.js');
const IncomingData = require('./modules/incomingdata.js');

const manager = new Manager();
const incomingData = new IncomingData(manager, 20);
incomingData.start();
incomingData.statistic();
