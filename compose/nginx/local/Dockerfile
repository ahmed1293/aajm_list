ARG DOCKER_REGISTRY

FROM ${DOCKER_REGISTRY}nginx:1.17.4-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY /compose/nginx/local/nginx.conf /etc/nginx/conf.d