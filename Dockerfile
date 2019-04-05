FROM node:dubnium

# Install puppeteer dependencies
RUN apt-get -qq update && \
    apt-get -qq install --no-install-recommends \
    libgtk-3-0 libxtst6 libxss1 libnss3 libasound2 > /dev/null && \
    rm -rf /var/lib/apt/lists/*

# Install forever
ENV NODE_ENV=production
RUN yarn global add forever

# Create working directory
RUN mkdir -p /usr/src/autocalamari
WORKDIR /usr/src/autocalamari

# Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Bundle app source
COPY src/ src/

# De-escalate privileges
USER node

# Start worker
CMD [
  "forever",
  "--minUptime",
  "1000",
  "--spinSleepTime",
  "1000",
  "src/index.js"
]
