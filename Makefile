.PHONY: \
	ci \
	lint test build \
	docker-dev docker-dev-build docker-dev-push \
	docker-prod docker-prod-build docker-prod-push

VERSION ?= 1.0.`date +%Y%m%d`
BASE_COMMIT_ID ?= ""

ci:
	docker build --build-arg base_commit_id="origin/master" \
	-t harbor.longguikeji.com/ark-releases/arkid-fe:$(VERSION) .

test:
	npm run test:unit

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
	docker build -t harbor.longguikeji.com/ark-releases/arkid-fe:$(VERSION) .

docker-dev-push:
	docker build -t harbor.longguikeji.com/ark-releases/arkid-fe:$(VERSION)

docker-prod: docker-prod-build docker-prod-push

docker-prod-build:
	docker build -t longguikeji/arkid-fe:$(VERSION) .

docker-prod-push:
	docker push longguikeji/arkid-fe:$(VERSION)
