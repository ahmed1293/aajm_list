ARG DOCKER_REGISTRY

FROM ${DOCKER_REGISTRY}python:3.7

ENV PYTHONBUFFERED 1

RUN mkdir /code
WORKDIR /code

# nc needed for entrypoint
RUN apt-get update && apt-get install -y netcat

COPY requirements.txt /code/
RUN pip install -r requirements.txt

COPY . /code/

ENTRYPOINT ["/code/compose/django/entrypoint.sh"]