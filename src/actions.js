const colors = require('colors/safe');

const now = timezone => (
  (new Date()).toLocaleString('en-US', { timeZone: timezone })
);

const punchIn = ({
  page,
  project,
  timezone,
}) => {
  console.log(colors.yellow(`[${now(timezone)}] Punch-In`));
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
  console.log(colors.green(`[${now(timezone)}] Punch-Out\n`));
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
  console.log(colors.green(`[${now(timezone)}] Start break`));
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
  console.log(colors.yellow(`[${now(timezone)}] Stop break`));
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

module.exports = config => ([
  ...(config.punchIn ? [{
    action: punchIn,
    desc: colors.yellow('Punch-in at:   '),
    time: config.punchIn,
  }] : []),
  ...(config.startBreak ? [{
    action: startBreak,
    desc: colors.green('Start break at:'),
    time: config.startBreak,
  }] : []),
  ...(config.stopBreak ? [{
    action: stopBreak,
    desc: colors.yellow('Stop break at: '),
    time: config.stopBreak,
  }] : []),
  ...(config.punchOut ? [{
    action: punchOut,
    desc: colors.green('Punch-out at:  '),
    time: config.punchOut,
  }] : []),
]);
