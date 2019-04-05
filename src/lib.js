const colors = require('colors/safe');
const { CronJob } = require('cron');
const puppeteer = require('puppeteer');

const now = timezone => (
  (new Date()).toLocaleString('en-US', { timeZone: timezone })
);

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
}) => {
  console.log(colors.blue(`Logging into ${domain}.calamari.io...`));
  return puppeteer
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
    ));
};

const punchIn = ({
  page,
  project,
  timezone,
}) => {
  console.log(colors.yellow(`Clock-in: ${now(timezone)}`));
  const projectLink = `//a[contains(text(), ${JSON.stringify(project)})]`;
  return Promise.all([
    page.$('button#buttonShift.startWork'),
    page.$('button#buttonBreak.stopBreak'),
  ])
    .then(([startWork, stopBreak]) => {
      if (!startWork && !stopBreak) {
        throw new Error('Error: Already on a shift');
      }
      if (stopBreak) {
        return stopBreak
          .click();
      }
      return startWork
        .click()
        .then(() => (
          page
            .waitForXPath(projectLink, { visible: true })
        ))
        .then(() => (
          page
            .$x(projectLink)
            .then(([link]) => (
              link.click()
            ))
        ));
    });
};

const punchOut = ({
  page,
  timezone,
}) => {
  console.log(colors.green(`Clock-out: ${now(timezone)}`));
  return Promise.all([
    page.$('button#buttonShift.stopWork'),
    page.$('button#buttonBreak.stopBreak'),
  ])
    .then(([stopWork, stopBreak]) => {
      if (!stopWork && !stopBreak) {
        throw new Error('Error: Not on a shift');
      }
      if (stopBreak) {
        return stopBreak
          .click()
          .then(() => page.waitForSelector('button#buttonShift.stopWork'))
          .then(() => page.$('button#buttonShift.stopWork'))
          .then(stopWork => stopWork.click());
      }
      return stopWork
        .click();
    });
};

const startBreak = ({
  page,
  project,
  timezone,
}) => {
  console.log(colors.green(`Start break: ${now(timezone)}`));
  return Promise.all([
    page.$('button#buttonBreak.stopBreak'),
    page.$('button#buttonShift.startWork'),
    page.$('button#buttonBreak.startBreak'),
  ])
    .then(([stopBreak, startWork, startBreak]) => {
      if (stopBreak) {
        throw new Error('Error: Already on a break');
      }
      if (startWork) {
        return punchIn({ page, project, timezone })
          .then(() => page.waitForSelector('button#buttonShift.startBreak'))
          .then(() => page.$('button#buttonBreak.startBreak'))
          .then(startBreak => startBreak.click());
      }
      return startBreak
        .click();
    });
};

const stopBreak = ({
  page,
  project,
  timezone,
}) => {
  console.log(colors.yellow(`Stop break: ${now(timezone)}`));
  return Promise.all([
    page.$('button#buttonShift.startWork'),
    page.$('button#buttonBreak.stopBreak'),
  ])
    .then(([startWork, stopBreak]) => {
      if (startWork) {
        return punchIn({ page, project, timezone });
      }
      if (!stopBreak) {
        throw new Error('Error: Not on a break');
      }
      return stopBreak
        .click();
    });
};

const actions = config => ([
  ...(config.punchIn ? [{
    action: punchIn,
    desc: colors.green('Punching-in at:   '),
    time: config.punchIn,
  }] : []),
  ...(config.startBreak ? [{
    action: startBreak,
    desc: colors.yellow('Starting break at:'),
    time: config.startBreak,
  }] : []),
  ...(config.stopBreak ? [{
    action: stopBreak,
    desc: colors.green('Stopping break at:'),
    time: config.stopBreak,
  }] : []),
  ...(config.punchOut ? [{
    action: punchOut,
    desc: colors.yellow('Punching-out at:  '),
    time: config.punchOut,
  }] : []),
]);

module.exports = config => (
  actions(config).map(({
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
      ), Math.random() * config.entropy * 1000),
      null,
      true,
      config.timezone
    );
  })
);
