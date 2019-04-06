const colors = require('colors/safe');

const log = (
  action,
  color,
  timezone
) => (
  console.log(colors[color](
    `[${(new Date()).toLocaleString('en-US', { timeZone: timezone })}]`,
    action
  ))
);

const punchIn = ({
  page,
  project,
  timezone,
}) => {
  log('Punch-In', 'red', timezone);
  const projectLink = `//a[contains(text(), ${JSON.stringify(project)})]`;
  return Promise.all([
    page.$('button#buttonShift.startWork'),
    page.$('button#buttonBreak.stopBreak'),
  ])
    .then(([startWork, stopBreak]) => {
      if (!startWork && !stopBreak) {
        throw new Error('Already on a shift');
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
        .then(link => (
          link.click()
        ));
    });
};

const punchOut = ({
  page,
  timezone,
}) => {
  log('Punch-Out', 'green', timezone);
  return Promise.all([
    page.$('button#buttonShift.stopWork'),
    page.$('button#buttonBreak.stopBreak'),
  ])
    .then(([stopWork, stopBreak]) => {
      if (!stopWork && !stopBreak) {
        throw new Error('Not on a shift');
      }
      if (stopBreak) {
        return stopBreak
          .click()
          .then(() => (
            page
              .waitForSelector('button#buttonShift.stopWork')
          ))
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
  log('Start break', 'green', timezone);
  return Promise.all([
    page.$('button#buttonShift.startWork'),
    page.$('button#buttonBreak.startBreak'),
  ])
    .then(([startWork, startBreak]) => {
      if (startWork) {
        return punchIn({ page, project, timezone })
          .then(() => (
            page
              .waitForSelector('button#buttonBreak.startBreak')
          ))
          .then(startBreak => startBreak.click());
      }
      if (!startBreak) {
        throw new Error('Already on a break');
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
  log('Stop break', 'red', timezone);
  return Promise.all([
    page.$('button#buttonShift.startWork'),
    page.$('button#buttonBreak.stopBreak'),
  ])
    .then(([startWork, stopBreak]) => {
      if (startWork) {
        return punchIn({ page, project, timezone });
      }
      if (!stopBreak) {
        throw new Error('Not on a break');
      }
      return stopBreak
        .click();
    });
};

module.exports = config => ([
  ...(config.punchIn ? [{
    action: punchIn,
    desc: colors.red('Punch-in at:   '),
    time: config.punchIn,
  }] : []),
  ...(config.startBreak ? [{
    action: startBreak,
    desc: colors.green('Start break at:'),
    time: config.startBreak,
  }] : []),
  ...(config.stopBreak ? [{
    action: stopBreak,
    desc: colors.red('Stop break at: '),
    time: config.stopBreak,
  }] : []),
  ...(config.punchOut ? [{
    action: punchOut,
    desc: colors.green('Punch-out at:  '),
    time: config.punchOut,
  }] : []),
]);
