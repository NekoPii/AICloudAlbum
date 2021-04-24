"""
ASGI config for MySite project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""
# daphne enable http2 see https://pypi.org/project/daphne/
# nginx see https://www.runoob.com/w3cnote/nginx-setup-intro.html
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AICloudAlbum.settings')

application = get_asgi_application()


