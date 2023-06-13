FROM keymetrics/pm2:latest-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY ecosystem.config.js ./
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production
# If you are building your code for production
# RUN npm ci --omit=dev


ENV PORT="3043"





# Bundle app source
COPY . .

EXPOSE 3043
RUN ls -al -R

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]