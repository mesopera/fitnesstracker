document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const ageSlider = document.querySelector(".age-slider");
  const selectedAgeDisplay = document.querySelector(".selected-age");
  const continueButton = document.querySelector(".continue-button");
  const backButton = document.querySelector(".back-button");

  // Configuration
  const minAge = 18;
  const maxAge = 99;
  const initialAge = 28;
  const visibleOptions = 5;

  // Initialize the age slider
  initAgeSlider();

  // Initialize the age slider with options
  function initAgeSlider() {
    // Clear existing content
    ageSlider.innerHTML = "";

    // Create age options
    for (let age = minAge; age <= maxAge; age++) {
      const ageOption = document.createElement("div");
      ageOption.className = "age-option";
      ageOption.textContent = age;
      ageOption.dataset.age = age;

      if (age === initialAge) {
        ageOption.classList.add("selected");
      }

      ageSlider.appendChild(ageOption);
    }

    // Set initial selected age
    selectedAgeDisplay.textContent = initialAge;

    // Scroll to initial age
    scrollToAge(initialAge);

    // Add event listeners
    ageSlider.addEventListener("scroll", handleScroll);

    // Add touch/mouse events for better mobile experience
    let isDown = false;
    let startX;
    let scrollLeft;

    ageSlider.addEventListener("mousedown", (e) => {
      isDown = true;
      ageSlider.classList.add("active");
      startX = e.pageX - ageSlider.offsetLeft;
      scrollLeft = ageSlider.scrollLeft;
    });

    ageSlider.addEventListener("mouseleave", () => {
      isDown = false;
      ageSlider.classList.remove("active");
    });

    ageSlider.addEventListener("mouseup", () => {
      isDown = false;
      ageSlider.classList.remove("active");
      snapToClosestAge();
    });

    ageSlider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - ageSlider.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed
      ageSlider.scrollLeft = scrollLeft - walk;
    });

    // Touch events
    ageSlider.addEventListener("touchstart", (e) => {
      isDown = true;
      ageSlider.classList.add("active");
      startX = e.touches[0].pageX - ageSlider.offsetLeft;
      scrollLeft = ageSlider.scrollLeft;
    });

    ageSlider.addEventListener("touchend", () => {
      isDown = false;
      ageSlider.classList.remove("active");
      snapToClosestAge();
    });

    ageSlider.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - ageSlider.offsetLeft;
      const walk = (x - startX) * 2;
      ageSlider.scrollLeft = scrollLeft - walk;
    });

    // Add click event to age options
    const ageOptions = document.querySelectorAll(".age-option");
    ageOptions.forEach((option) => {
      option.addEventListener("click", function () {
        const age = parseInt(this.dataset.age);
        scrollToAge(age);
        updateSelectedAge(age);
      });
    });

    // Add button event listeners
    continueButton.addEventListener("click", function (e) {
      const selectedAge = parseInt(selectedAgeDisplay.textContent);
      const selectedGender = localStorage.getItem("userGender");
      
      // Save user data to database
      saveUserData(selectedGender, selectedAge);
      
      console.log("Continuing with age:", selectedAge);
    });

    backButton.addEventListener("click", function () {
      console.log("Going back");
      // Back navigation handled by HTML link
    });
  }

  // Handle scroll event
  function handleScroll() {
    // Debounce the scroll event
    clearTimeout(ageSlider.scrollTimeout);
    ageSlider.scrollTimeout = setTimeout(() => {
      snapToClosestAge();
    }, 100);

    // Update selected age during scroll
    updateSelectedAgeOnScroll();
  }

  // Update the selected age based on scroll position
  function updateSelectedAgeOnScroll() {
    const ageOptions = document.querySelectorAll(".age-option");
    const sliderCenter = ageSlider.offsetWidth / 2;
    let closestOption = null;
    let minDistance = Infinity;

    ageOptions.forEach((option) => {
      const optionCenter =
        option.offsetLeft + option.offsetWidth / 2 - ageSlider.scrollLeft;
      const distance = Math.abs(optionCenter - sliderCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestOption = option;
      }
    });

    if (closestOption) {
      const age = parseInt(closestOption.dataset.age);
      updateSelectedAge(age);
    }
  }

  // Save user data to the database
  // async function saveUserData(gender, age) {
  //   if (!gender || !age) {
  //     alert("Both gender and age are required!");
  //     return;
  //   }

  //   try {
  //     const response = await fetch('/api/save-user', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         gender,
  //         age
  //       }),
  //     });

  //     const data = await response.json();
      
  //     if (response.ok) {
  //       // Save user ID to localStorage for future use
  //       localStorage.setItem('userId', data.userId);
  //       console.log('User data saved successfully:', data);
  //     } else {
  //       console.error('Failed to save user data:', data.error);
  //       alert('Failed to save user data. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Error saving user data:', error);
  //     alert('An error occurred while saving your data.');
  //   }
  // }

  // Snap to the closest age after scrolling stops
  function snapToClosestAge() {
    const ageOptions = document.querySelectorAll(".age-option");
    const sliderCenter = ageSlider.offsetWidth / 2;
    let closestOption = null;
    let minDistance = Infinity;

    ageOptions.forEach((option) => {
      const optionCenter =
        option.offsetLeft + option.offsetWidth / 2 - ageSlider.scrollLeft;
      const distance = Math.abs(optionCenter - sliderCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestOption = option;
      }
    });

    if (closestOption) {
      const age = parseInt(closestOption.dataset.age);

      // Add a subtle animation to nearby options
      ageOptions.forEach((option) => {
        const optionAge = parseInt(option.dataset.age);
        const distance = Math.abs(optionAge - age);

        if (distance <= 2 && optionAge !== age) {
          // Add a subtle animation to nearby options
          option.style.transition = "transform 0.5s ease, opacity 0.5s ease";
          option.style.transitionDelay = `${distance * 0.05}s`;
        }
      });

      scrollToAge(age);
      updateSelectedAge(age);
    }
  }

  // Scroll to a specific age
  function scrollToAge(age) {
    const ageOption = document.querySelector(`.age-option[data-age="${age}"]`);
    if (ageOption) {
      const optionCenter = ageOption.offsetLeft + ageOption.offsetWidth / 2;
      const sliderCenter = ageSlider.offsetWidth / 2;

      // Use standard smooth scrolling for better performance
      ageSlider.scrollTo({
        left: optionCenter - sliderCenter,
        behavior: "smooth",
      });
    }
  }

  // Update the selected age display and styling
  function updateSelectedAge(age) {
    // Save to localStorage
    localStorage.setItem("userAge", age);
    
    // Animate the selected age display
    selectedAgeDisplay.classList.add("animate");

    // Use setTimeout to change the text during the animation
    setTimeout(() => {
      selectedAgeDisplay.textContent = age;
      selectedAgeDisplay.classList.remove("animate");
      selectedAgeDisplay.classList.add("animate-back");

      // Remove the animate-back class after animation completes
      setTimeout(() => {
        selectedAgeDisplay.classList.remove("animate-back");
      }, 300);
    }, 150);

    // Update selected class with animation
    const ageOptions = document.querySelectorAll(".age-option");
    ageOptions.forEach((option) => {
      if (parseInt(option.dataset.age) === age) {
        if (!option.classList.contains("selected")) {
          option.classList.add("selected");
        }
      } else {
        option.classList.remove("selected");
      }
    });
  }
});