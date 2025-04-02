document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const maleButton = document.querySelector(".male-icon");
    const femaleButton = document.querySelector(".female-icon");
    const continueButton = document.querySelector(".continue-button");
    const backButton = document.querySelector(".back-button");
    const genderIcons = document.querySelectorAll(".gender-icon");
  
    // Initialize state
    let selectedGender = null;
  
    // Initially disable continue button
    continueButton.disabled = true;
  
    // Add event listeners to gender options
    genderIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        // Remove selected class from all icons
        genderIcons.forEach((btn) => btn.classList.remove("selected"));
  
        // Add selected class to clicked icon
        this.classList.add("selected");
  
        // Store selected gender
        if (this.classList.contains("male-icon")) {
          selectedGender = "male";
        } else if (this.classList.contains("female-icon")) {
          selectedGender = "female";
        }
  
        // Enable continue button
        continueButton.disabled = false;
  
        // Log selection for debugging
        console.log("Selected gender:", selectedGender);
      });
    });
  
    // Handle continue button click
    continueButton.addEventListener("click", function (e) {
      if (!selectedGender) {
        e.preventDefault();
        alert("Please select a gender to continue");
        return;
      }
  
      // Store the selection in localStorage for persistence
      localStorage.setItem("userGender", selectedGender);
  
      // Here you would typically submit the form or navigate to the next page
    //   alert(
    //     `Gender selected: ${selectedGender}. Ready to proceed to the next step!`,
    //   );
  
      // For demonstration purposes - in a real app you would redirect or submit a form
      console.log("Form submission with gender:", selectedGender);
    });
  
    // Handle back button click
    backButton.addEventListener("click", function () {
      // In a real app, you would navigate back to the previous page
      // For demonstration purposes
      if (
        confirm("Are you sure you want to go back? Your selection will be lost.")
      ) {
        console.log("Navigating back...");
        // history.back(); // Uncomment in a real application
      }
    });
  
    // Check if there's a previously selected gender in localStorage
    const savedGender = localStorage.getItem("userGender");
    if (savedGender) {
      if (savedGender === "male") {
        maleButton.classList.add("selected");
        selectedGender = "male";
      } else if (savedGender === "female") {
        femaleButton.classList.add("selected");
        selectedGender = "female";
      }
  
      // Enable continue button if we have a saved selection
      continueButton.disabled = false;
    }
  });
  