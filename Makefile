run:
	docker-compose up -d

loadstatic:
	docker-compose run --rm node npm run dev
	docker-compose run --rm django python manage.py collectstatic --noinput

pytest:
	docker-compose run --rm django pytest -s

jest:
	docker-compose run --rm node npm run test

ci-test: pytest jest

