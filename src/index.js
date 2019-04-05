const colors = require('colors/safe');
const dotenv = require('dotenv');
const setupCronJobs = require('./lib.js');

dotenv.config();

const config = {
  domain: process.env.DOMAIN,
  project: process.env.PROJECT,
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

if (!config.domain || !config.project || !config.email || !config.password) {
  console.error(colors.red('Error: You must provide a domain, project, email & password'));
  process.exit(1);
}

console.log([
  '',
  colors.rainbow(' AutoCalamari '),
  colors.rainbow('========================='),
  `${colors.white('Email:')}    ${colors.blue(config.email)}`,
  `${colors.white('Domain:')}   ${colors.blue(`${config.domain}.calamari.io`)}`,
  `${colors.white('Project:')}  ${colors.blue(config.project)}`,
  ...(config.entropy > 0 ? [
    `${colors.white('Entropy:')}  ${colors.blue(`~${Math.floor(config.entropy / 60)} minutes`)}`,
  ] : []),
  '',
].join('\n'));
setupCronJobs(config);
console.log('');
