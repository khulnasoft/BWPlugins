FROM node:12.3.1-slim

ARG BW_TEST_NAME

COPY ./ ./

RUN npm install

ENV BW_TEST_NAME=$BW_TEST_NAME

EXPOSE 8080

CMD ["node", "app.js"]
