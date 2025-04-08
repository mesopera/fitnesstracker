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
  });
  