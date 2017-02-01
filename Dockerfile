FROM node:4-onbuild

EXPOSE 8000

RUN npm run bower -- install --allow-root && \
    npm run gulp -- build

CMD npm run serve -- --proxy http://upstream/
