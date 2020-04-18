from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from graphene_django.views import GraphQLView
from rest_framework import permissions


schema_view = get_schema_view(
   openapi.Info(
      title="AAJM API",
      default_version='v1',
      description="Internal APIs for AAJM List app",
      contact=openapi.Contact(email="ahmed.code.1293@gmail.com"),
      license=openapi.License(name="BSD License"),
   ),
   permission_classes=(permissions.AllowAny,),
)


admin.site.site_header = "AAJM"
admin.site.site_title = "Admin"
admin.site.index_title = "AAJM Admin"


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('list.api.urls')),
    path('', include('frontend.urls')),

    path('graphql/', GraphQLView.as_view(graphiql=True)),

    # swagger
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
