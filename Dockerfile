FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install env-cmd
COPY . .
RUN npm run build
EXPOSE 4200
CMD ["npm", "run", "start"]