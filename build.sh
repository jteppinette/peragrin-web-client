# !/usr/bin/env bash
set -e

PROJECT=web-client
TARGET=$PROJECT

while getopts ":t:" opt; do
  case $opt in
    t)
      TARGET=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

docker run -v `pwd`:/src --rm node:7 /bin/sh -c "cd /src; npm install; npm run build:prod"
docker build -t $TARGET .
