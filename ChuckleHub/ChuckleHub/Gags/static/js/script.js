document.addEventListener("DOMContentLoaded", () => {
  const jokeElement = document.getElementById("joke");
  const getJokeButton = document.getElementById("get-joke");
  const jokeList = document.getElementById("joke-list");
  const refreshJokesButton = document.getElementById("refresh-jokes");
  const themeToggle = document.getElementById("checkbox");
  const jokeRating = document.getElementById("joke-rating");
  const stars = document.querySelectorAll(".stars i");
  const jokeReaction = document.getElementById("joke-reaction");
  const jokeLevelSelect = document.getElementById("joke-level");

  let currentJokeId = null;

  if (getJokeButton) {
    getJokeButton.addEventListener("click", fetchJoke);
    fetchJoke();
  }

  if (refreshJokesButton) {
    refreshJokesButton.addEventListener("click", fetchJokesList);
    fetchJokesList();
  }

  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-theme")
    );
  });

  // Check for saved theme preference
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark-theme");
    themeToggle.checked = true;
  }

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const rating = star.getAttribute("data-rating");
      rateJoke(currentJokeId, rating);
    });
  });

  if (refreshJokesButton) {
    refreshJokesButton.addEventListener("click", () =>
      fetchJokesList(jokeLevelSelect.value)
    );
    fetchJokesList(jokeLevelSelect.value);
  }

  if (jokeLevelSelect) {
    jokeLevelSelect.addEventListener("change", () =>
      fetchJokesList(jokeLevelSelect.value)
    );
  }
  async function fetchJoke() {
    try {
      const response = await fetch("/get_joke/");
      const data = await response.json();
      currentJokeId = data.id;
      jokeElement.textContent = data.joke;
      animateJoke(jokeElement);
      jokeRating.classList.remove("hidden");
      resetStars();
    } catch (error) {
      console.error("Error fetching joke:", error);
      jokeElement.textContent = "Failed to fetch a joke. Please try again!";
    }
  }

  async function fetchJokesList(level = "clean") {
    try {
      const response = await fetch(`/get_jokes_list/?level=${level}`);
      const data = await response.json();
      jokeList.innerHTML = "";
      data.jokes.forEach((joke) => {
        const li = document.createElement("li");
        li.textContent = joke;
        jokeList.appendChild(li);
        animateJoke(li);
      });
    } catch (error) {
      console.error("Error fetching jokes list:", error);
      jokeList.innerHTML = "<li>Failed to fetch jokes. Please try again!</li>";
    }
  }

  function animateJoke(element) {
    gsap.fromTo(
      element,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }

  async function rateJoke(jokeId, rating) {
    try {
      const response = await fetch("/rate_joke/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ joke_id: jokeId, rating: rating }),
      });
      const data = await response.json();
      if (data.success) {
        showReaction(rating);
      }
    } catch (error) {
      console.error("Error rating joke:", error);
    }
  }

  function resetStars() {
    stars.forEach((star) => star.classList.remove("active"));
  }

  function showReaction(rating) {
    const reactions = ["😐", "🙂", "😊", "😄", "🤣"];
    jokeReaction.textContent = reactions[rating - 1];
    gsap.fromTo(
      jokeReaction,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
  }
});
