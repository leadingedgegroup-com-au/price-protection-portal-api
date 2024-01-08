FROM node:latest
WORKDIR /srv/app
COPY ["package.json", "./"]
RUN npm install && mv node_modules ../
RUN ls --all
RUN npm install -g pm2
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["pm2-runtime", "dist/main.js"]
