AutoCalamari &nbsp;
[![Build Status](https://travis-ci.org/danielesteban/AutoCalamari.svg?branch=master)](https://travis-ci.org/danielesteban/AutoCalamari)
[![Dependencies Status](https://david-dm.org/danielesteban/AutoCalamari/status.svg)](https://david-dm.org/danielesteban/AutoCalamari)
[![Docker Pulls](https://img.shields.io/docker/pulls/danigatunes/autocalamari.svg)](https://hub.docker.com/r/danigatunes/autocalamari)
===

> Automated Calamari Clock-In/Out

Copyright © 2019 Daniel Esteban Nombela.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Headless service deployment

 * [Docker](https://hub.docker.com/search/?type=edition&offering=community) >= 18.09 Stable
 * [Docker Compose](https://docs.docker.com/compose/install/) >= 1.24 Stable

```bash
# Download the docker-compose template
mkdir AutoCalamari && cd AutoCalamari 
curl -O https://raw.githubusercontent.com/danielesteban/AutoCalamari/master/docker-compose.yml
# Edit the environment config
vim docker-compose.yml
# Start the service
docker-compose up -d
```

[![Screenshot](screenshot.png)](https://hub.docker.com/r/danigatunes/autocalamari)

## Dev environment

 * [Node.js](https://nodejs.org/en/download/) >= 10.15 LTS
 * [Yarn](https://yarnpkg.com/en/docs/install) >= 1.15 Stable

```bash
# Clone this repo
git clone https://github.com/danielesteban/AutoCalamari.git && cd AutoCalamari
# Install dependencies
yarn install
# Setup your environment
echo "DOMAIN=__WRITE_YOUR_CALAMARI_SUBDOMAIN_HERE__" > .env
echo "PROJECT=__WRITE_YOUR_CALAMARI_PROJECT_HERE__" >> .env
echo "EMAIL=__WRITE_YOUR_EMAIL_HERE__" >> .env
echo "PASSWORD=__WRITE_YOUR_PASSWORD_HERE__" >> .env
echo "PUNCH_IN=00 00 09 * * 1-5" >> .env
echo "START_BREAK=00 00 14 * * 1-5" >> .env
echo "STOP_BREAK=00 00 15 * * 1-5" >> .env
echo "PUNCH_OUT=00 00 18 * * 1-5" >> .env
echo "HEADLESS=false" >> .env
# Start the worker
yarn start
```

## FAQ

 * [What's the job scheduling format?](#whats-the-job-scheduling-format)
 * [What's my calamari domain?](#whats-my-calamari-domain)
 * [What's my calamari password?](#whats-my-calamari-password)
 * [What's my calamari project?](#whats-my-calamari-project)

#### What's the job scheduling format?

[Read up on cron patterns here](http://crontab.org/). Note the examples in the link have five fields and 1 minute as the finest granularity, but this project has six fields with 1 second as the finest granularity.

There are also tools that will help you construct your schedules like: [crontab.guru](https://crontab.guru/) and [cronjob.xyz](https://cronjob.xyz/).

#### What's my calamari domain?

The part before `.calamari.io` in your calamari URL.

#### What's my calamari password?

If you signed-up with your google account or you don't know/remember your password, you can use the [Password Reset Form](https://app.calamari.io/o/remind-password) to get a new one.

#### What's my calamari project?

The text that reads on any of the buttons that pop up when you start a work shift.

If you don't provide any, it will default to: `Without project`.
