const { exec } = require('child_process');

module.exports = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject(error);
      }
      console.log(stdout);
      resolve({ code: 0 });
    });
  });
};
