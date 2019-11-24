ARG DOCKER_REGISTRY

FROM ${DOCKER_REGISTRY}node:13

WORKDIR /app

COPY package*.json ./

RUN npm install --quiet

COPY . .