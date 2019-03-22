require('shelljs/global');
// Sync call to exec()
var version = exec('node --version', {
  silent: true
}).output;

console.log(version);
// Async call to exec()
exec('vue create xxx', function (status, output) {
  console.log('Exit status:', status);
  console.log('Program output:', output);
});