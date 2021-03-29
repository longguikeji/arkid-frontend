# FROM node:10.20.1-buster AS builder
# USER root
# WORKDIR /workspace
# COPY .npmrc /root/

FROM harbor.longguikeji.com/haaiff/haaiff-admin:builder AS builder
COPY . .
RUN npm install &&\
    npm run build:prod

FROM nginx:alpine
ENV TZ Asia/Shanghai
EXPOSE 80
COPY --from=builder /workspace/dist /usr/share/nginx/html/admin/