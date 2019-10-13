docker-pull:
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml pull --quiet

docker-push:
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml push

build-ci:
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml build

migrate-ci:
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml run --rm django python manage.py migrate

pytest-ci:
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml run --rm django coverage run -m py.test
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml run --rm django coverage report -m
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml run --rm django coverage html
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml run --rm django coverage xml

jest-ci:
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml run --rm node npm run testCov

local:
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml -f docker-compose.override.yml up -d

loadstatic:
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml -f docker-compose.override.yml node npm run dev
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml -f docker-compose.override.yml run --rm django python manage.py collectstatic --noinput

pytest:
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml -f docker-compose.override.yml run --rm django pytest -s

jest:
	docker-compose -f docker-compose.prod.yml -f docker-compose.yml -f docker-compose.override.yml run --rm node npm run test


