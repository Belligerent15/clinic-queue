FROM node:18-alpine
RUN apk add --no-cache python3 make g++ gcc
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
RUN npm install
RUN cd client && npm install
COPY . .
RUN npm run build
EXPOSE 5000
ENV PORT=5000
ENV NODE_ENV=production
CMD ["npm", "start"]
