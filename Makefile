.PHONY: backend-install
backend-install:
	docker-compose run --rm backend yarn install

.PHONY: frontend-install
frontend-install:
	docker-compose run --rm frontend yarn install

.PHONY: restart
restart:
	make down
	make up

.PHONY: restart-new
restart-new:
	make down
	docker-compose up --build

.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down

.PHONY: status
status:
	docker-compose ps

.PHONY: migrate
migrate:
	docker-compose exec backend yarn run migrate

.PHONY: watch
watch:
	docker-compose up -d && docker-compose exec frontend yarn run dev

.PHONY: build
build:
	docker-compose exec frontend yarn run build

.PHONY: sh
sh:
	docker-compose exec backend sh

.PHONY: test-backend
test-backend:
	docker-compose exec backend yarn run test

.PHONY: frontend-clean
frontend-clean:
	rm -rf frontend/node_modules 2>/dev/null || true
	docker-compose exec frontend yarn cache clean

.PHONY: rm
rm:
	docker-compose down -v

.PHONY: logs
logs:
	docker-compose logs -f
