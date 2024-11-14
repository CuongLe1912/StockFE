#FROM node:14.15 AS builder
FROM devopsmeey/meeyadmin-ui:v1.0.6 AS builder

WORKDIR /app

ADD . /app
#RUN npm i --force
#RUN npm i mimetext@2.0.7 --force
RUN npm install
RUN npm run build
RUN ls -al /app/dist

FROM nginx:alpine

ADD deploy/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/meey-admin /usr/share/nginx/html
RUN ls -al /usr/share/nginx/html

