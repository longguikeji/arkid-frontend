TAG ?= `date +%Y%m%d`

docker: docker-build docker-push

docker-build:
	docker build -t harbor.longguikeji.com/ark-releases/ark-oneid-fe:$(TAG) .

docker-push:
	docker push harbor.longguikeji.com/ark-releases/ark-oneid-fe:$(TAG)