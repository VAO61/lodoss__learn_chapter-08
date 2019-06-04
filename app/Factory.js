const IncomingData = require('./IncomingData.js');
const WebProject = require('./projects/WebProject.js');
const MobileProject = require('./projects/MobileProject.js');

const ProjectFactory = {
  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  createRandomProject() {
    if (Math.random() > 0.5) {
      // function pick(list) {
      //   const idx = Math.floor(Math.random() * list.length);
      //   const el = list[idx];
      //   return el;
      // }

      // if (pick(['web', 'mob']) == 'web') {
      return new WebProject(ProjectFactory.getRandom(1, 3));
    } else {
      return new MobileProject(ProjectFactory.getRandom(1, 3));
    }
  }
};

// const DeveloperFactory = {
//   createMobileDeveloper() {
//     return new MobileDeveloper();
//   }
// };
// console.log(ProjectFactory.getRandom(1, 3));

console.log('\n__Проверка подключения. Всё в порядке!__\n');

// module.exports = { DeveloperFactory, ProjectFactory };
// TODO: некорректный экспорт, сыпется код
module.exports = ProjectFactory;
