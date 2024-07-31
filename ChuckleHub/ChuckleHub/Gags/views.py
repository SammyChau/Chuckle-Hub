from django.shortcuts import render
from django.http import JsonResponse
import requests
from django.views.decorators.csrf import csrf_exempt
import json
from django.core.cache import cache


def home(request):
    return render(request, "Gags/index.html")


def joke_list(request):
    return render(request, "Gags/joke_list.html")


def about(request):
    return render(request, "Gags/about.html")


def get_joke(request):
    try:
        response = requests.get(
            "https://icanhazdadjoke.com/", headers={"Accept": "application/json"}
        )
        data = response.json()
        return JsonResponse({"joke": data["joke"]})
    except:
        return JsonResponse(
            {"joke": "Failed to fetch a joke. Please try again!"}, status=500
        )


def get_jokes_list(request):
    level = request.GET.get("level", "clean")
    try:
        response = requests.get(
            "https://v2.jokeapi.dev/joke/Any",
            params={"amount": 10, "type": "single", "safe-mode": level != "dark"},
        )
        data = response.json()
        return JsonResponse({"jokes": [joke["joke"] for joke in data["jokes"]]})
    except:
        return JsonResponse({"jokes": []}, status=500)


@csrf_exempt
def rate_joke(request):
    if request.method == "POST":
        data = json.loads(request.body)
        joke_id = data.get("joke_id")
        rating = data.get("rating")

        # Store rating in cache (or database in a real-world scenario)
        ratings = cache.get("joke_ratings", {})
        if joke_id in ratings:
            ratings[joke_id].append(rating)
        else:
            ratings[joke_id] = [rating]
        cache.set("joke_ratings", ratings)

        return JsonResponse(
            {"success": True, "message": f"Joke {joke_id} rated {rating}"}
        )
    return JsonResponse({"success": False, "message": "Invalid request"}, status=400)


def get_joke_stats(request):
    ratings = cache.get("joke_ratings", {})
    stats = {
        joke_id: {"average": sum(r) / len(r), "count": len(r)}
        for joke_id, r in ratings.items()
    }
    return JsonResponse({"stats": stats})
