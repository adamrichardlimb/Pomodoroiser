FROM node:18.16.0-alpine

RUN mkdir -p /srv/app/frontend
WORKDIR /srv/app/frontend

COPY package.json /srv/app/frontend
COPY package-lock.json /srv/app/frontend

COPY . /srv/app/frontend

RUN npm install npm -g
RUN npm ci

CMD [ "npm", "run", "dev" ]