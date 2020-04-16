FROM node:10
COPY ./client /client
COPY ./server /server
WORKDIR /client
RUN npm install
RUN npm install -g typescript
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm install -g react-scripts
RUN react-scripts build
WORKDIR /server
RUN npm install
RUN npm install -g typescript
RUN tsc
CMD ["npm", "start", "dev"]

EXPOSE 8080 