const { CronJob } = require('cron');
const puppeteer = require('puppeteer');

const now = (timezone) => (
  (new Date()).toLocaleString('en-US', { timeZone: timezone })
);

const typeValue = (page, selector, value) => (
  page
    .$(selector)
    .then((e) => (
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
  console.log(`Launching ${domain} calamari...`);
  return puppeteer
    .launch({
      args: ['--no-sandbox'],
      headless,
    })
    .then(browser => (
      browser
        .pages()
        .then(([page]) => {
          console.log(`Log-in as: ${email}`);
          return page
            .goto(`https://${domain}.calamari.io/clockin/main.do`, { waitUntil: 'networkidle2' })
            .then(() => (
              page
                .waitFor('input[name=email]')
            ))
            .then(() => (
              typeValue(page, 'input[name=email]', email)
            ))
            .then(() => (
              typeValue(page, 'input[name=password]', password)
            ))
            .then(() => (
              page
                .click('button[type="submit"]')
            ))
            .then(() => (
              page
                .waitFor('button#buttonShift')
            ))
            .then(() => (
              page
                .waitFor(() => (
                  !document.querySelector('#applicationPreloader')
                ))
            ))
            .then(() => ({
              browser,
              page,
            }))
        })
    ));
};

module.exports.punchIn = ({
  page,
  project,
  timezone,
}) => {
  console.log(`Clock-in: ${now(timezone)}`);
  const projectLink = `//a[contains(text(), ${JSON.stringify(project)})]`;
  return page
    .$('button#buttonShift.startWork')
    .then((button) => {
      if (!button) {
        throw new Error('Error: Already on a shift');
      }
      return button
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

module.exports.punchOut = ({ page, timezone }) => {
  console.log(`Clock-out: ${now(timezone)}`);
  return page
    .$('button#buttonShift.stopWork')
    .then((button) => {
      if (!button) {
        throw new Error('Error: Not on a shift');
      }
      return button
        .click();
    });
};

module.exports.setupJob = ({
  time,
  action,
  config,
}) => (
  new CronJob(
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
  )
);
