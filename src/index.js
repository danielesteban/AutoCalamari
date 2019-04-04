const colors = require('colors/safe');
const dotenv = require('dotenv');
const {
  punchIn,
  punchOut,
  setupJob,
} = require('./lib.js');

dotenv.config();

const config = {
  domain: process.env.DOMAIN,
  project: process.env.PROJECT,
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  punchIn: process.env.PUNCH_IN,
  punchOut: process.env.PUNCH_OUT,
  entropy: parseInt(process.env.ENTROPY || 0, 10),
  timezone: process.env.TIMEZONE || 'Europe/Madrid',
  headless: process.env.HEADLESS === 'false' ? false : true,
};

console.log(colors.blue('Automation FTW!'));
console.log(colors.white(`${config.email}`));

console.log(colors.green(`Punching in at: ${config.punchIn}`));
setupJob({
  time: config.punchIn,
  action: punchIn,
  config,
});

console.log(colors.yellow(`Punching out at: ${config.punchOut}`));
setupJob({
  time: config.punchOut,
  action: punchOut,
  config,
});
