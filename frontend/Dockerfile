FROM node:22-alpine as build

WORKDIR /app

COPY hello-frontend/package*.json ./
RUN npm ci

COPY hello-frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/hello-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]