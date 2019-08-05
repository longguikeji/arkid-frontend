FROM node:8.15-alpine AS build_deps
WORKDIR /workspace
COPY . .

RUN yarn install \
    --ignore-engines \
    --frozen-lockfile \
    --non-interactive

FROM build_deps AS build
ARG META

RUN echo $META > meta.txt \
    && npm run build

FROM nginx:alpine
ENV TZ Asia/Chongqing
COPY --from=build /workspace/dist /app/fe/_/s/
COPY --from=build /workspace/meta.txt /app/fe/_/s/meta.txt
ADD etc/nginx.default.conf /etc/nginx/conf.d/default.conf

CMD nginx -g "daemon off;"
