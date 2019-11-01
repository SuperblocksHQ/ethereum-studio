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
COPY packages/editor/templates ./packages/editor/templates
COPY packages/editor/scripts/postinstall.js ./packages/editor/scripts/postinstall.js
COPY packages/editor/scripts/generate-templates.js ./packages/editor/scripts/generate-templates.js
RUN mkdir -p /app/packages/editor/src/assets/static/json
RUN mkdir -p /app/packages/editor/src/assets/static/json/templates

# RUN npm i
# If you are building your code for production
RUN npx lerna bootstrap --hoist

# Bundle app source
COPY . .

RUN npm run $BUILD

EXPOSE 80
CMD [ "npm", "run", "start:prod" ]
