FROM node:19.4.0

# set working directory
RUN mkdir /app
WORKDIR /app

# install deps
COPY package*.json ./
RUN npm install

# copy api files
COPY bridge.js ./

CMD [ "node", "bridge.js" ]