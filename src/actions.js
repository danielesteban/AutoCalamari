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
  return Promise.all([
    page.$('c-label[name="workPlan.dayOff"]'),
    page.$('button#buttonBreak.stopBreak'),
    page.$('button#buttonShift.startWork'),
  ])
    .then(([dayOff, stopBreak, startWork]) => {
      if (dayOff) {
        throw new Error('Day off');
      }
      if (stopBreak) {
        return stopBreak
          .click();
      }
      if (!startWork) {
        throw new Error('Already on a shift');
      }
      return startWork
        .click()
        .then(() => (
          page
            .waitForXPath(
              `//a[contains(text(), ${JSON.stringify(project)})]`,
              { visible: true }
            )
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
    page.$('button#buttonBreak.stopBreak'),
    page.$('button#buttonShift.stopWork'),
  ])
    .then(([stopBreak, stopWork]) => {
      if (stopBreak) {
        return stopBreak
          .click()
          .then(() => (
            page
              .waitForSelector('button#buttonShift.stopWork')
          ))
          .then(stopWork => stopWork.click());
      }
      if (!stopWork) {
        throw new Error('Not on a shift');
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
    page.$('c-label[name="workPlan.dayOff"]'),
    page.$('button#buttonShift.startWork'),
    page.$('button#buttonBreak.startBreak'),
  ])
    .then(([dayOff, startWork, startBreak]) => {
      if (dayOff) {
        throw new Error('Day off');
      }
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
