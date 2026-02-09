from django.urls import path
from . import views

urlpatterns = [
    path("predict/", views.health_predict, name="health_predict"),
]