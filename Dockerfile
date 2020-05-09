FROM node:12.16.1
WORKDIR /usr/src/
COPY . .
RUN npm install
EXPOSE 80
CMD ["node", "server.js"]