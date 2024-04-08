FROM node:14-alpine as build

# set working directory
WORKDIR /app

# add app
COPY . /app

# install and cache app dependencies
RUN npm install
RUN npm install -g @angular/cli@~12.1.1

EXPOSE 4200

# start app
CMD ng serve --host 0.0.0.0
