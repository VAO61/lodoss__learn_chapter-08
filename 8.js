const Manager = require('./app/Manager.js');
const IncomingData = require('./app/IncomingData.js');

const manager = new Manager();
const incomingData = new IncomingData(manager, 500);
incomingData.start();
incomingData.statistic();
