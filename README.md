AutoCalamari
===

> Automated Calamari Clock-In/Out

[![Build Status](https://travis-ci.org/danielesteban/AutoCalamari.svg?branch=master)](https://travis-ci.org/danielesteban/AutoCalamari)
[![dependencies Status](https://david-dm.org/danielesteban/AutoCalamari/status.svg)](https://david-dm.org/danielesteban/AutoCalamari)


#### Headless service deployment

```bash
# Download the docker-compose template
mkdir AutoCalamari && cd AutoCalamari 
curl -O https://raw.githubusercontent.com/danielesteban/AutoCalamari/master/docker-compose.yml
# Edit the environment config
vim docker-compose.yml
# Start the service
docker-compose up -d
```

#### Dev environment

```bash
# Setup your environment
echo "DOMAIN=__WRITE_YOUR_CALAMARI_SUBDOMAIN_HERE__" > .env
echo "PROJECT=__WRITE_YOUR_CALAMARI_PROJECT_HERE__" >> .env
echo "EMAIL=__WRITE_YOUR_EMAIL_HERE__" >> .env
echo "PASSWORD=__WRITE_YOUR_PASSWORD_HERE__" >> .env
echo "PUNCH_IN=00 09 * * 1-5" >> .env
echo "START_BREAK=00 14 * * 1-5" >> .env
echo "STOP_BREAK=00 15 * * 1-5" >> .env
echo "PUNCH_OUT=00 18 * * 1-5" >> .env
echo "HEADLESS=false" >> .env
# Start the worker
node src/index.js
```

#### FAQ

 * [What's the job scheduling format?](#whats-the-job-scheduling-format)
 * [What's my calamari password?](#whats-my-calamari-password)
 * [What's my calamari project?](#whats-my-calamari-project)
 * [What's my calamari domain?](#whats-my-calamari-domain)

##### What's the job scheduling format?

[Read up on cron patterns here](http://crontab.org/). Note the examples in the link have five fields, and 1 minute as the finest granularity, but this project has six fields, with 1 second as the finest granularity.

There are also tools that will help you construct your schedules like: [crontab.guru](https://crontab.guru/) and [cronjob.xyz](https://cronjob.xyz/).

##### What's my calamari password?

If you signed-up with your google account or you don't know/remember your password, you can use the [Password Reset Form](https://app.calamari.io/o/remind-password) to get a new one.

##### What's my calamari project?

The text that reads on any of the buttons that pop up when you start a work shift.

##### What's my calamari domain?

The part before '.calamari.io' in your calamari URL
