# template start(模版内容标志行，不可删除)
# typescript项目的基本Dockerfile模版，主要包含test，lint，build相关检查，项目需要根据自身情况修改该模版
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

# custom start(自定义内容标志行与下面空行，不可删除)
