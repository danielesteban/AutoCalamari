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
