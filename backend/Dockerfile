FROM node:18.16.0-alpine

RUN mkdir -p /srv/app/backend
WORKDIR /srv/app/backend

COPY package.json /srv/app/backend
COPY package-lock.json /srv/app/backend

RUN npm install

COPY . /srv/app/backend

CMD [ "npm", "run", "dev" ]