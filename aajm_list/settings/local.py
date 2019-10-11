from .base import *

DEBUG = True

ALLOWED_HOSTS = []

# trick to have debug toolbar when developing with docker
ip = socket.gethostbyname(socket.gethostname())
INTERNAL_IPS += [ip[:-1] + '1']