// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get("email") || "user@kioskeats.com";
const token = urlParams.get("token");

// Set email to HTML element if it exists
const emailElement = document.getElementById("email");
if (emailElement) emailElement.textContent = email;

// Password toggle functionality
const passwordField = document.getElementById("password");
const togglePassword = document.querySelector(".toggle-password");
const visibilityText = document.getElementById("visibility");
const errorText = document.getElementById("error");
const updateButton = document.getElementById("updateBtn");

if (togglePassword && passwordField && visibilityText) {
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordField.type === "password";
    passwordField.type = isPassword ? "text" : "password";
    visibilityText.textContent = isPassword ? "Hide" : "Show";
  });
}

const updatePassword = async () => {
  const password = passwordField.value.trim();

  errorText.style.color = "red";
  // Check if password field is empty
  if (!password) {
    errorText.textContent = "Password field is empty";
    return;
  }

  // Disable button and reduce opacity while loading
  updateButton.disabled = true;
  updateButton.style.opacity = "0.6";
  updateButton.textContent = "Updating...";

  // Prepare request payload
  const requestBody = {
    token: token, // Token from URL parameter
    password: password,
  };
  const url = `http://api.kioskeats.online/auth/update-password`;
  console.log(`url is ${url}`);

  try {
    // Call the API endpoint
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle API errors
      throw new Error(result.result || "Something went wrong!");
    }

    // Success message
    errorText.style.color = "green";
    errorText.textContent = "Password updated successfully!";
    passwordField.value = ""; // Clear the input field
  } catch (error) {
    // Display error message
    errorText.style.color = "red";
    errorText.textContent = error.message;
  } finally {
    // Enable button and reset opacity after response
    updateButton.disabled = false;
    updateButton.style.opacity = "1";
    updateButton.textContent = "Update Password";
  }
};
