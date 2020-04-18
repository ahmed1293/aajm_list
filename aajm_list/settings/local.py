import socket

from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost']

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, 'frontend/static')
STATIC_URL = '/static/'

# trick to have debug toolbar when developing with docker
ip = socket.gethostbyname(socket.gethostname())
INTERNAL_IPS += [ip[:-1] + '1']