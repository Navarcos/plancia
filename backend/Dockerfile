FROM golang:1.22.5 as builder

WORKDIR /app
COPY ./ /app
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o bin/main cmd/*.go


FROM gcr.io/distroless/static-debian11:latest
WORKDIR /app
COPY --from=builder /app/manifest /app/manifest
COPY --from=builder /app/bin/main /app/main
EXPOSE 8080
ENTRYPOINT ["./main"]
