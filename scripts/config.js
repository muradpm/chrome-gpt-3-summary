// Configuration file for the extension
// This file loads environment variables and provides them to the extension

// Default configuration (used if .env file is not available)
const defaultConfig = {
  apiKey: "YOUR_API_KEY_HERE", // Replace with your API key for development
  model: "gpt-4o-mini",
  maxTokens: 800,
  temperature: 0.5,
};

// Function to load configuration from storage
async function loadConfig() {
  return new Promise((resolve) => {
    chrome.storage.local.get("config", (result) => {
      if (result.config && result.config.apiKey) {
        resolve(result.config);
      } else {
        resolve(defaultConfig);
      }
    });
  });
}

// Function to save configuration to storage
async function saveConfig(config) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ config }, resolve);
  });
}

// Export the configuration functions
export { loadConfig, saveConfig, defaultConfig };
