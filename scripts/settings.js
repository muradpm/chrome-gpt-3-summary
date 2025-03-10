// Default configuration
const defaultConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  model: "gpt-4o-mini",
  maxTokens: 800,
  temperature: 0.5,
};

// Initialize the settings page
document.addEventListener("DOMContentLoaded", () => {
  // Load the current configuration
  chrome.storage.local.get("config", (result) => {
    const config = result.config || defaultConfig;

    // Populate the form with the current configuration
    document.getElementById("api-key").value =
      config.apiKey === defaultConfig.apiKey ? "" : config.apiKey;
    document.getElementById("model").value = config.model || defaultConfig.model;
    document.getElementById("max-tokens").value =
      config.maxTokens || defaultConfig.maxTokens;

    const temperatureInput = document.getElementById("temperature");
    const temperatureValue = document.getElementById("temperature-value");
    temperatureInput.value = config.temperature || defaultConfig.temperature;
    temperatureValue.textContent = temperatureInput.value;
  });

  // Add event listeners
  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "popup.html";
  });

  document
    .getElementById("show-hide-key")
    .addEventListener("click", togglePasswordVisibility);

  document.getElementById("temperature").addEventListener("input", () => {
    document.getElementById("temperature-value").textContent =
      document.getElementById("temperature").value;
  });

  document.getElementById("save-settings").addEventListener("click", saveSettings);
});

// Toggle password visibility
function togglePasswordVisibility() {
  const apiKeyInput = document.getElementById("api-key");
  const eyeIcon = document.querySelector("#show-hide-key i");

  if (apiKeyInput.type === "password") {
    apiKeyInput.type = "text";
    eyeIcon.className = "far fa-eye-slash";
  } else {
    apiKeyInput.type = "password";
    eyeIcon.className = "far fa-eye";
  }

  // Ensure the input field maintains focus
  setTimeout(() => {
    apiKeyInput.focus();
    // Move cursor to end of input
    const length = apiKeyInput.value.length;
    apiKeyInput.setSelectionRange(length, length);
  }, 0);
}

// Save settings
function saveSettings() {
  const apiKey = document.getElementById("api-key").value.trim();
  const model = document.getElementById("model").value;
  const maxTokens = parseInt(document.getElementById("max-tokens").value);
  const temperature = parseFloat(document.getElementById("temperature").value);

  // Validate the API key
  if (!apiKey) {
    showStatusMessage("Please enter your OpenAI API key", "error");
    return;
  }

  // Create the new configuration
  const newConfig = {
    apiKey,
    model,
    maxTokens,
    temperature,
  };

  try {
    // Save the configuration
    chrome.storage.local.set({ config: newConfig }, () => {
      showStatusMessage("Settings saved successfully!", "success");

      // Redirect back to the popup after a short delay
      setTimeout(() => {
        window.location.href = "popup.html";
      }, 1500);
    });
  } catch (error) {
    showStatusMessage("Error saving settings: " + error.message, "error");
  }
}

// Show status message
function showStatusMessage(message, type) {
  const statusMessage = document.getElementById("status-message");
  statusMessage.textContent = message;
  statusMessage.className = type;

  // Hide the message after 3 seconds
  setTimeout(() => {
    statusMessage.className = "";
  }, 3000);
}
