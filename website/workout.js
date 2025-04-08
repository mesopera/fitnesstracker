// DOM Elements
const workoutCards = document.querySelectorAll(".workout-card");
const filterButtons = document.querySelectorAll(".filter-btn");
const favoriteButtons = document.querySelectorAll(".favorite-btn");
const modal = document.getElementById("workout-modal");
const modalClose = document.querySelector(".modal-close");
const modalTitle = document.getElementById("modal-workout-title");
const modalDuration = document.getElementById("modal-duration");
const modalCalories = document.getElementById("modal-calories");
const modalExercises = document.getElementById("modal-exercises");
const startButton = document.querySelector(".start-btn");
const scheduleButton = document.querySelector(".schedule-btn");

// Initialize favorites from localStorage
const initFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem("workoutFavorites")) || [];

  favoriteButtons.forEach((btn) => {
    const card = btn.closest(".workout-card");
    const workoutTitle = card.querySelector(".workout-title").textContent;

    if (favorites.includes(workoutTitle)) {
      btn.classList.add("active");
    }
  });
};

// Save favorites to localStorage
const saveFavorites = () => {
  const favorites = [];
  document.querySelectorAll(".favorite-btn.active").forEach((btn) => {
    const card = btn.closest(".workout-card");
    const workoutTitle = card.querySelector(".workout-title").textContent;
    favorites.push(workoutTitle);
  });

  localStorage.setItem("workoutFavorites", JSON.stringify(favorites));
};

// Open modal with workout details
const openWorkoutModal = (card) => {
  const title = card.querySelector(".workout-title").textContent;
  const duration =
    card.querySelector(".ti-clock").nextElementSibling.textContent;
  const calories =
    card.querySelector(".ti-flame").nextElementSibling.textContent;
  const exercises =
    card.querySelector(".ti-activity").nextElementSibling.textContent;

  modalTitle.textContent = title;
  modalDuration.textContent = duration;
  modalCalories.textContent = calories;
  modalExercises.textContent = exercises;

  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
};

// Close modal
const closeModal = () => {
  modal.classList.remove("active");
  document.body.style.overflow = ""; // Restore scrolling
};

// Filter workouts
const filterWorkouts = (filterType) => {
  workoutCards.forEach((card) => {
    if (filterType === "all") {
      card.style.display = "block";
    } else {
      const cardType = card.dataset.type;
      card.style.display = cardType === filterType ? "block" : "none";
    }
  });
};

// Event Listeners

// Workout card click
workoutCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    // Don't open modal if favorite button was clicked
    if (!e.target.closest(".favorite-btn")) {
      openWorkoutModal(card);
    }
  });
});

// Filter buttons
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to clicked button
    button.classList.add("active");

    // Filter workouts
    const filterType = button.dataset.filter;
    filterWorkouts(filterType);
  });
});

// Favorite buttons
favoriteButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent card click event
    button.classList.toggle("active");
    saveFavorites();
  });
});

// Close modal when clicking the close button
modalClose.addEventListener("click", closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

// Start workout button
startButton.addEventListener("click", () => {
  alert("Starting workout: " + modalTitle.textContent);
  closeModal();
});

// Schedule workout button
scheduleButton.addEventListener("click", () => {
  alert("Scheduling workout: " + modalTitle.textContent);
  closeModal();
});

// Sort workouts by duration or calories
const sortWorkouts = (property, ascending = true) => {
  const workoutList = document.querySelector(".workout-list");
  const cards = Array.from(workoutCards);

  cards.sort((a, b) => {
    const valueA = parseInt(a.dataset[property]);
    const valueB = parseInt(b.dataset[property]);

    return ascending ? valueA - valueB : valueB - valueA;
  });

  // Clear and re-append sorted cards
  workoutList.innerHTML = "";
  cards.forEach((card) => workoutList.appendChild(card));
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initFavorites();
});
