FROM node:18-alpine as build-deps
WORKDIR /app

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL $REACT_APP_API_BASE_URL

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY ./src ./src
COPY ./public ./public

RUN DISABLE_ESLINT_PLUGIN=true npm run build

EXPOSE 3000
CMD ["npm", "start"]
