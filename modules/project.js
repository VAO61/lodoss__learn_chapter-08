module.exports = class Project {
  constructor(type, difficulty) {
    this.type = type;
    this.difficulty = difficulty;
    this.progress = 0;
  }
};

class WebProject extends Project {}
class MobilProject extends Project {}
class TestProject extends Project {}
