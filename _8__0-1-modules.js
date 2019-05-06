const TYPE_PROJECT_WEB = 'Web';
const TYPE_PROJECT_MOBILE = 'Mobile';

const SPECIALIZATION_WEB = 'Web';
const SPECIALIZATION_MOBILE = 'Mobile';
const SPECIALIZATION_TEST = 'Test';

const IncomingData = require('./modules/incomingdata');
const Manager = require('./modules/manager');
const Department = require('./modules/department');
const Project = require('./modules/project');
const Developer = require('./modules/developer');

const manager = new Manager();
const incomingData = new IncomingData(manager, 20);
incomingData.start();
incomingData.statistic();
