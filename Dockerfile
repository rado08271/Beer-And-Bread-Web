FROM node:16
WORKDIR /etc/bab/
COPY ./package.json .
RUN npm install
COPY . .