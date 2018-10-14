const { spawn } = require('child_process');

module.exports = (command) => {
  return new Promise((resolve) => {
    const child = spawn(command, { shell: true, stdio: 'inherit' });
    child.on('close', (code) => {
      resolve({ code });
    });
  });
};
