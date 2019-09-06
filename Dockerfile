FROM node:10
ARG BUILD

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY lerna*.json ./
COPY packages/editor/package*.json ./packages/editor/
COPY packages/web-server/package*.json ./packages/web-server/

# RUN npm i
# If you are building your code for production
RUN npx lerna bootstrap --hoist

# Bundle app source
COPY . .

RUN npm run $BUILD

EXPOSE 80
CMD [ "npm", "run", "start:prod" ]
