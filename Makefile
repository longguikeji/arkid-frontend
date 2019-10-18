VERSION ?= 1.0.`date +%Y%m%d`
BASE_COMMIT_ID ?= ""

test:
	@echo test

lint:
	@if [ ${BASE_COMMIT_ID}x != ""x ]; \
	then \
		git reset ${BASE_COMMIT_ID}; \
		git add .; \
	fi
	
	npx lint-staged

build: docker-dev-build

docker-dev: docker-dev-build docker-dev-push

docker-dev-build:
	docker build -t harbor.longguikeji.com/ark-releases/ark-oneid-fe:$(VERSION) .

docker-dev-push:
	docker build -t harbor.longguikeji.com/ark-releases/ark-oneid-fe:$(VERSION)

docker-prod: docker-prod-build docker-prod-push

docker-prod-build:
	docker build -t longguikeji/ark-oneid-fe:$(VERSION) .

docker-prod-push:
	docker push longguikeji/ark-oneid-fe:$(VERSION)
