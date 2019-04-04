AutoCalamari
[![Build Status](https://travis-ci.org/danielesteban/AutoCalamari.svg?branch=master)](https://travis-ci.org/danielesteban/AutoCalamari)
===

> Automated Calamari Clock-In/Out

#### Development

[![dependencies Status](https://david-dm.org/danielesteban/AutoCalamari/status.svg)](https://david-dm.org/danielesteban/AutoCalamari)
[![devDependencies Status](https://david-dm.org/danielesteban/AutoCalamari/dev-status.svg)](https://david-dm.org/danielesteban/AutoCalamari?type=dev)

```bash
echo "DOMAIN=__WRITE_YOUR_CALAMARI_DOMAIN_HERE__" > .env
echo "PROJECT=__WRITE_YOUR_CALAMARI_PROJECT_HERE__" >> .env
echo "EMAIL=__WRITE_YOUR_EMAIL_HERE__" >> .env
echo "PASSWORD=__WRITE_YOUR_PASSWORD_HERE__" >> .env
echo "PUNCH_IN=0 9 * * 1-5" >> .env
echo "PUNCH_OUT=0 18 * * 1-5" >> .env
echo "HEADLESS=false" >> .env
```

#### Deployment
 * Edit the environment config in: [docker-compose.yml](docker-compose.yml)
 * Launch the [docker container](https://hub.docker.com/r/danigatunes/autocalamari) with: `docker-compose up -d`
