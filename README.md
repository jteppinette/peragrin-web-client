# Peragrin Client - *an Angular front end to the Peragrin application*

## Development

### Required Software

* [docker](https://docs.docker.com/)
* [git](https://git-scm.com/)
* [nodejs](https://nodejs.org/en/download/)

### Dependencies

This client application requires the [Peragrin API](https://github.com/jteppinette/peragrin-api) backend.

### Getting Started

1. `git clone <repo-url>`

2. `cd <repo-name>`

3. `npm install`

5. `npm run watch:dev`

## Usage

### Docker

1. `npm install`

3. `npm run build:dev`

4. `docker build . -t client`

5. `docker run
      -d
      -p 8080:80
      --link app:upstream
      --name client
      client`

## Logging

The new improved JSON logging can be combined with the powerful tool `jq` to follow and monitor the
Nginx proxy logs.

The following command will print all new logs as rendered JSON. `man jq` to learn more ways
to render and analyze the JSON logs.

```
docker container logs --since `date +%s` -f `docker ps --filter name=web-client -q` | jq .
```
