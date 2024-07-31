from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("jokes/", views.joke_list, name="joke_list"),
    path("about/", views.about, name="about"),
    path("get_joke/", views.get_joke, name="get_joke"),
    path("get_jokes_list/", views.get_jokes_list, name="get_jokes_list"),
    path("rate_joke/", views.rate_joke, name="rate_joke"),
    path("get_joke_stats/", views.get_joke_stats, name="get_joke_stats"),
]
