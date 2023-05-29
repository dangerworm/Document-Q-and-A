FROM postgres:latest
WORKDIR /postgres

ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=postgres
ENV PGUSER=postgres

COPY ./init.sql /docker-entrypoint-initdb.d/
