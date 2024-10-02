# syntax=docker/dockerfile:1

FROM node:20.9.0-alpine AS frontend
WORKDIR /frontend
COPY kohi-frontend /frontend
RUN ["npm", "i", "--omit=dev"]
RUN ["npm", "run", "build"]

FROM node:20.9.0-alpine AS backend
WORKDIR /backend
COPY kohi-backend /backend
RUN ["npm", "i", "--omit=dev"]
RUN ["npm", "run", "build"]

FROM node:20.9.0-alpine AS final
WORKDIR /usr/src/app

COPY --from=backend /backend/dist /usr/src/app/dist
COPY --from=backend /backend/package.json /usr/src/app/package.json
COPY --from=frontend /frontend/dist /usr/src/app/dist/frontend-dist

RUN ["npm", "i", "--omit=dev"]

CMD ["npm", "run", "start:prod"]