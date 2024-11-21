from django.urls import path
from rest_framework import routers
from .upload_history import upload_history, public_upload_history

router = routers.DefaultRouter()
urlpatterns = [
    path("me/uploads/", upload_history, name='upload_history'),
    path("me/uploads/public", public_upload_history, name='public_upload_history'),
]

urlpatterns += router.urls
