FROM node:18-alpine
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --chown=nodejs:nodejs package*.json ./
RUN npm ci --only=production && npm cache clean --force
RUN npm install env-cmd
COPY --chown=nodejs:nodejs . . 
RUN npm run build
EXPOSE 3000

USER nodejs

CMD ["npm", "run", "start"]
