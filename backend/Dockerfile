FROM golang:1.22-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o backend

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/backend .

EXPOSE 5000

CMD ["./backend"]
