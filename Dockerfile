FROM node:10.20.1-buster AS builder
USER root
WORKDIR /workspace

COPY . .
RUN npm install 
RUN npm run build:prod

FROM nginx:alpine
ENV TZ Asia/Shanghai
EXPOSE 80
COPY --from=builder /workspace/dist /usr/share/nginx/html/
