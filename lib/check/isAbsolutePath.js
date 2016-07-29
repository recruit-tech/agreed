const fs = require('fs');

module.exports = (path) => {
  try {
    return fs.statSync(path).isAbsolute();
  } catch(e) {
    return false;
  }
};
