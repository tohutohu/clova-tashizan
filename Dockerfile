FROM node:slim
ENV HOME=/work
WORKDIR /work
COPY package.json package-lock.json /work/
RUN npm i

