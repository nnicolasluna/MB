#### Build
FROM node:22.16.0-alpine3.21 AS build

WORKDIR /app

COPY . .

RUN npm install && npm run build:prod

#### RUN
FROM nginxinc/nginx-unprivileged:stable-alpine

COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
