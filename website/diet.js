// DOM Elements
const mealTabs = document.querySelectorAll(".meal-tab");
const favoriteButtons = document.querySelectorAll(".favorite-button");
const addButton = document.querySelector(".add-button");
const modal = document.querySelector(".add-meal-modal");
const closeModalButton = document.querySelector(".close-modal");
const addMealForm = document.querySelector(".add-meal-form");
const mealList = document.querySelector(".meal-list");

// Toggle active tab
function setActiveTab(event) {
  // Remove active class from all tabs
  mealTabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  // Add active class to clicked tab
  event.currentTarget.classList.add("active");

  // In a real app, you would fetch and display meals for the selected category
  const category = event.currentTarget.textContent;
  console.log(`Showing ${category} meals`);
}

// Toggle favorite status
function toggleFavorite(event) {
  const starIcon = event.currentTarget.querySelector(".favorite-icon");

  if (starIcon.classList.contains("favorite-active")) {
    starIcon.classList.remove("favorite-active");
  } else {
    starIcon.classList.add("favorite-active");
  }
}

// Show add meal modal
function showAddMealModal() {
  modal.classList.add("show");
  document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
}

// Hide add meal modal
function hideAddMealModal() {
  modal.classList.remove("show");
  document.body.style.overflow = ""; // Restore scrolling
  addMealForm.reset(); // Reset form fields
}

// Close modal when clicking outside the form
function handleModalClick(event) {
  if (event.target === modal) {
    hideAddMealModal();
  }
}

async function saveUserData(user_id, food_name, preptime, calories, date) {
  try {
    // Make sure the date is in YYYY-MM-DD format
    let formattedDate;
    
    if (date instanceof Date) {
      formattedDate = date.toISOString().split('T')[0];
    } else if (typeof date === 'string' && date.includes('T')) {
      // If it's an ISO string like '2025-04-15T22:42:23.641Z'
      formattedDate = date.split('T')[0];
    } else {
      // Assume it's already formatted correctly
      formattedDate = date;
    }
    
    const response = await fetch('/api/save-diet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id, 
        food_name, 
        preptime, 
        calories, 
        date: formattedDate
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      // Save user ID to localStorage for future use
      localStorage.setItem('userId', data.userId);
      console.log('User data saved successfully:', data);
      return true;
    } else {
      console.error('Failed to save user data:', data.error);
      alert('Failed to save user data. Please try again.');
      return false;
    }
  } catch (error) {
    console.error('Error saving user data:', error);
    alert('An error occurred while saving your data.');
    return false;
  }
}

// Add new meal
function addNewMeal(event) {
  event.preventDefault();

  // Get form values
  const title = document.getElementById("meal-title").value;
  const time = document.getElementById("prep-time").value;
  const calories = document.getElementById("calories").value;
  const imageUrl =
    document.getElementById("image-url").value ||
    "https://placehold.co/300x200/FF1F6B/FF1F6B";

  // Create new meal card
  const newMealCard = document.createElement("article");
  newMealCard.className = "meal-card";

  // Save user data
  const userId = localStorage.getItem('userId');
  // if (!userId) {
  //   userId = 5;
  // }
  const today = new Date();
  const dateOnly = today.toISOString().split('T')[0];
  saveUserData(userId, title, time, calories, dateOnly);

  newMealCard.innerHTML = `
    <div class="meal-info">
      <h2 class="meal-title">${title}</h2>
      <div class="meal-details">
        <div class="detail-item">
          <i class="ti ti-clock detail-icon"></i>
          <span class="detail-text">${time} Minutes</span>
        </div>
        <div class="detail-item">
          <i class="ti ti-flame detail-icon"></i>
          <span class="detail-text">${calories} Cal</span>
        </div>
      </div>
    </div>
    <img src="${imageUrl}" alt="${title}" class="meal-image">
    <div class="favorite-button">
      <i class="ti ti-star favorite-icon"></i>
    </div>
  `;

  // Add event listener to the new favorite button
  const newFavoriteButton = newMealCard.querySelector(".favorite-button");
  newFavoriteButton.addEventListener("click", toggleFavorite);

  // Add the new meal card to the list
  mealList.appendChild(newMealCard);

  // Hide modal after adding
  hideAddMealModal();

  // Show confirmation message
  showNotification(`${title} added successfully!`);
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.add("hide");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

// Event Listeners
mealTabs.forEach((tab) => {
  tab.addEventListener("click", setActiveTab);
});

favoriteButtons.forEach((button) => {
  button.addEventListener("click", toggleFavorite);
});

addButton.addEventListener("click", showAddMealModal);
closeModalButton.addEventListener("click", hideAddMealModal);
modal.addEventListener("click", handleModalClick);
addMealForm.addEventListener("submit", addNewMeal);

// Bottom navigation functionality
const navIcons = document.querySelectorAll(".nav-icon");

navIcons.forEach((icon) => {
  icon.addEventListener("click", function () {
    // Remove active class from all icons
    navIcons.forEach((navIcon) => {
      navIcon.classList.remove("active");
    });

    // Add active class to clicked icon
    this.classList.add("active");

    // In a real app, you would navigate to different sections
    console.log(`Navigating to ${this.className.split(" ")[1]} section`);
  });
});