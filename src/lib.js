const colors = require('colors/safe');
const { CronJob } = require('cron');
const crypto = require('crypto');
const puppeteer = require('puppeteer');
const actions = require('./actions');

const typeValue = ({
  page,
  selector,
  value,
}) => (
  page
    .$(selector)
    .then(e => (
      e.click()
    ))
    .then(() => (
      page.keyboard.type(value)
    ))
);

const launchCalamari = ({
  domain,
  email,
  password,
  headless,
}) => (
  puppeteer
    .launch({
      args: ['--no-sandbox'],
      headless,
    })
    .then(browser => (
      browser
        .pages()
        .then(([page]) => (
          page
            .goto(`https://${domain}.calamari.io/clockin/main.do`, { waitUntil: 'networkidle2' })
            .then(() => (
              page
                .waitForSelector('input[name=email]')
            ))
            .then(() => (
              typeValue({
                page,
                selector: 'input[name=email]',
                value: email,
              })
            ))
            .then(() => (
              typeValue({
                page,
                selector: 'input[name=password]',
                value: password,
              })
            ))
            .then(() => (
              page
                .click('button[type="submit"]')
            ))
            .then(() => (
              page
                .waitForSelector('button#buttonShift')
            ))
            .then(() => (
              page
                .waitForFunction('!document.querySelector("#applicationPreloader")')
            ))
            .then(() => ({
              browser,
              page,
            }))
        ))
    ))
);

const MAX_UINT32 = (2 ** 32) - 1;
const getRandomDelay = entropy => (
  Math.floor((entropy * 1000) * Math.abs(
    (new Uint32Array(crypto.randomBytes(Uint32Array.BYTES_PER_ELEMENT).buffer))[0] / MAX_UINT32
  ))
);

module.exports = function setupCronJobs(config) {
  const jobs = actions(config).map(({
    action,
    desc,
    time,
  }) => {
    console.log(
      desc,
      time
        .trim()
        .split(' ')
        .reduce((t, v) => (
          `${t} ${colors[v === '*' ? 'blue' : 'gray'](v)}`
        ), '')
    );
    return new CronJob(
      time,
      () => setTimeout(() => (
        launchCalamari(config)
          .then(({ browser, page }) => {
            action({
              ...config,
              page,
            })
              .then(() => (
                page.waitFor(1000)
              ))
              .catch(e => (
                console.error(e.message)
              ))
              .finally(() => (
                browser.close()
              ));
          })
      ), getRandomDelay(config.entropy)),
      null,
      true,
      config.timezone
    );
  });
  console.log('');
  return jobs;
};
