FROM node:slim
ENV HOME=/work
COPY package.json pacage-lock.json /work
RUN npm i

