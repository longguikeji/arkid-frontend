FROM node:12-buster AS build_deps
USER root
WORKDIR /workspace

COPY . .
RUN npm install 

FROM build_deps AS run_lint
RUN echo "lint"

FROM build_deps AS run_test
RUN echo "test"

FROM build_deps AS build
RUN npm run build:prod

FROM nginx:alpine
ENV TZ Asia/Shanghai
EXPOSE 80
COPY --from=build /workspace/dist /usr/share/nginx/html/
