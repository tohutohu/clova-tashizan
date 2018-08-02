FROM node:slim
ENV HOME=/work
COPY package.json package-lock.json /work/
RUN npm i

