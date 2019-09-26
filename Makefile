run:
	docker-compose up -d

loadstatic:
	npm run dev
	docker-compose run --rm django python manage.py collectstatic --noinput

test:
	docker-compose run --rm django pytest -s