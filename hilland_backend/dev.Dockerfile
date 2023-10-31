FROM node:19.1.0-alpine
  
WORKDIR /usr/src/app

COPY . .
RUN npm install


USER node
CMD ["npm","run","dev"]