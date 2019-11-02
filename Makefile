local:
	docker-compose up -d django postgres

loadstatic:
	docker-compose run --rm node npm run dev
	docker-compose run --rm django python manage.py collectstatic --noinput

pytest:
	docker-compose run --rm django pytest -s

pytest-ci:
	docker-compose run --rm django coverage run -m py.test
	docker-compose run --rm django coverage report -m
	docker-compose run --rm django coverage html
	docker-compose run --rm django coverage xml

jest:
	docker-compose run --rm node npm run test

jest-ci:
	docker-compose run --rm node npm run testCov

ci-test: pytest-ci jest-ci

