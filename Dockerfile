ARG CODE_VERSION=17.9
FROM node:$CODE_VERSION


ARG NODE_ENV

RUN apt update

WORKDIR /usr/src/app
RUN npm cache clear --force
COPY . .
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

RUN npm install

COPY . .
COPY wait-for-it.sh .

ENV PORT 4000
EXPOSE $PORT
CMD [ "npm", "start" ]
