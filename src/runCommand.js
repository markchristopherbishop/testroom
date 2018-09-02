const { exec } = require('child_process');

module.exports = (command) => {
  return new Promise((resolve, reject) => {
    const child = exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
      console.log(stdout);
    });
    
    child.on('data', function (data) {
      console.log(data);
    });
    
    child.on('exit', function (code) {
      setTimeout(() => {
        console.log('Testing completed');
        resolve({ code });
      }, 1);
    });
  });
};
