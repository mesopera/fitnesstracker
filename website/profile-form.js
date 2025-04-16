document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const attachmentButton = document.getElementById("attachmentButton");
  const profileImageInput = document.getElementById("profileImageInput");
  const profilePicture = document.getElementById("profilePicture");
  
  // Add click event to attachment button
  attachmentButton.addEventListener("click", function () {
    // Trigger the hidden file input
    profileImageInput.click();
  });
  
  // Add change event to file input
  profileImageInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    
    // Check if a file was selected
    if (!file) return;
    
    // Validate file type
    if (!file.type.match("image.*")) {
      alert("Please select an image file (jpg, png, gif, etc.)");
      return;
    }
    
    // Create a FileReader to read the image
    const reader = new FileReader();
    
    // Set up the FileReader onload event
    reader.onload = function (loadEvent) {
      // Update the profile picture with the selected image
      profilePicture.style.backgroundImage = `url(${loadEvent.target.result})`;
      profilePicture.style.backgroundSize = "cover";
      profilePicture.style.backgroundPosition = "center";
      
      // Add a class to indicate an image has been uploaded
      profilePicture.classList.add("has-image");
      
      // Save the profile image data to localStorage if you need it on other pages
      localStorage.setItem("profileImage", loadEvent.target.result);
      
      // Announce for screen readers
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.classList.add("sr-only");
      announcement.textContent = "Profile picture uploaded successfully";
      document.body.appendChild(announcement);
      
      // Remove announcement after it's been read
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };
    
    // Read the image file as a data URL
    reader.readAsDataURL(file);
  });
  
  // Add keyboard support for the attachment button
  attachmentButton.addEventListener("keydown", function (event) {
    // Trigger click on Enter or Space
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      attachmentButton.click();
    }
  });

  // Handle submit button and anchor tag
  const submitButton = document.getElementById("submitButton");
  const submitAnchor = submitButton.querySelector("a");
  
  // Add click event to the submit button or anchor
  submitButton.addEventListener("click", saveAndNavigate);
  submitAnchor.addEventListener("click", function(e) {
    // Prevent default navigation
    e.preventDefault();
    saveAndNavigate();
  });
  
  function saveAndNavigate() {
    // Get form field values
    const fullname = document.getElementById("fullname").value;
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    
    // Store form data in localStorage
    localStorage.setItem("fullname", fullname);
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", mobile);
    
    window.location.href = "gender-selection.html";
  }
});