const fs = require('fs');

const writeFile = (fileName, data) => {
  return new Promise((resolve) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) {
        log(`write ${fileName} failed:`, err);
        resolve(false);
        return;
      }
      console.log(`The file ${fileName} has been saved!`);
      resolve(true);
    });
  });
};

const readFile = (fileName, fileType) => {
  return new Promise((resolve) => {
    fs.readFile(fileName, fileType, (err, data) => {
      if (err) {
        log(`readFile ${fileName} failed: `, err);
        resolve(false);
        return;
      }
      resolve(data);
    });
  });
};

exports.readFile = readFile;
exports.writeFile = writeFile;
