FROM node:8.15 AS build_deps
WORKDIR /workspace
COPY *.json *.js *.lock ./
RUN yarn install \
    --ignore-engines \
    --frozen-lockfile \
    --non-interactive

FROM build_deps AS run_lint
COPY . .
ARG base_commit_id=""
RUN make BASE_COMMIT_ID=${base_commit_id} lint

FROM build_deps AS run_test
COPY . .
RUN make test

FROM build_deps AS build
COPY . .
ARG META
RUN echo $META > meta.txt \
    && npm run build

FROM nginx:alpine
ENV TZ Asia/Chongqing
COPY --from=build /workspace/dist /app/fe/_/s/
COPY --from=build /workspace/meta.txt /app/fe/_/s/meta.txt
ADD etc/nginx.default.conf /etc/nginx/conf.d/default.conf

CMD nginx -g "daemon off;"
