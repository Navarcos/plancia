FROM gcr.io/distroless/static-debian11:latest

WORKDIR /app
COPY ./bin/main /app/main
COPY ./manifest /app/manifest

EXPOSE 8080
CMD [ "./main" ]