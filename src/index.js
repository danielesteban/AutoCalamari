const colors = require('colors/safe');
const dotenv = require('dotenv');
const {
  printConfig,
  setupCronJobs,
} = require('./autocalamari.js');

dotenv.config();

const config = {
  domain: process.env.DOMAIN,
  project: process.env.PROJECT || 'Without project',
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  punchIn: process.env.PUNCH_IN,
  startBreak: process.env.START_BREAK,
  stopBreak: process.env.STOP_BREAK,
  punchOut: process.env.PUNCH_OUT,
  entropy: parseInt(process.env.ENTROPY || 0, 10),
  timezone: process.env.TIMEZONE || 'Europe/Madrid',
  headless: process.env.HEADLESS !== 'false',
};

if (!config.domain || !config.email || !config.password) {
  console.error(colors.red('Error: You must provide a domain, email & password'));
  process.exit(1);
}

printConfig(config);
setupCronJobs(config);
