FROM node:16.9.1

WORKDIR /app/src

COPY ["package.json", "./"]

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
