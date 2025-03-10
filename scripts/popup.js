// Initialize UI
document.addEventListener("DOMContentLoaded", async () => {
  // Load configuration from storage
  chrome.storage.local.get("config", (result) => {
    const config = result.config || {
      apiKey: "YOUR_API_KEY_HERE",
      model: "gpt-4o-mini",
      maxTokens: 800,
      temperature: 0.5,
    };

    // Check if API key is set
    if (!config.apiKey || config.apiKey === "YOUR_API_KEY_HERE") {
      document.getElementById("api-key-missing").style.display = "block";
      document.getElementById("summarize").style.display = "none";
    } else {
      // Show summary container if we have a cached summary
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;
        chrome.storage.local.get(tabId.toString(), (data) => {
          if (data[tabId]) {
            displaySummaryAndFacts(data[tabId]);
          }
        });
      });
    }
  });

  // Add event listeners for settings
  document.getElementById("settings-btn").addEventListener("click", () => {
    window.location.href = "settings.html";
  });

  document.getElementById("go-to-settings").addEventListener("click", () => {
    window.location.href = "settings.html";
  });

  // Add history button event listener
  document.getElementById("history-btn").addEventListener("click", showHistory);

  // Add close history button event listener
  document.getElementById("close-history").addEventListener("click", closeHistory);

  // Add clear history button event listener
  document.getElementById("clear-history").addEventListener("click", clearAllHistory);

  // Connect to background script to get cached summary
  const port = chrome.runtime.connect({ name: "summary" });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    port.postMessage({ action: "getSummary", tabId });
  });

  port.onMessage.addListener((msg) => {
    if (msg.action === "displaySummary" && msg.summary) {
      displaySummaryAndFacts(msg.summary);
    }
  });
});

// Summarize button click handler
document.getElementById("summarize").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Show loading state
  document.getElementById("summary").innerHTML =
    '<div class="loading">Generating summary...</div>';
  document.getElementById("summary-container").style.display = "block";
  document.getElementById("facts-list").innerHTML = "";

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["scripts/content.js"],
    },
    () => {
      chrome.tabs.sendMessage(tab.id, { action: "summarize" });
    }
  );
});

// Refresh button click handler
document.getElementById("refresh").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Show loading state
  document.getElementById("summary").innerHTML =
    '<div class="loading">Refreshing summary...</div>';
  document.getElementById("facts-list").innerHTML = "";

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["scripts/content.js"],
    },
    () => {
      chrome.tabs.sendMessage(tab.id, { action: "summarize" });
    }
  );
});

// Copy button click handler
document.getElementById("copy").addEventListener("click", () => {
  const summaryText = document.getElementById("summary").innerText;
  navigator.clipboard.writeText(summaryText).then(() => {
    // Show copied feedback
    const copyBtn = document.getElementById("copy");
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="far fa-copy"></i>';
    }, 2000);
  });
});

// Clear button click handler
document.getElementById("clear").addEventListener("click", () => {
  // Clear the summary and facts
  document.getElementById("summary").innerText = "";
  document.getElementById("facts-list").innerHTML = "";

  // Don't hide the summary container, just show a message
  document.getElementById("summary").innerText =
    "Summary cleared. Click 'Summarize This Page' to generate a new summary.";

  // Clear the cached summary for this tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.storage.local.remove(tabId.toString());
  });
});

// Like/dislike buttons
document.getElementById("like").addEventListener("click", function () {
  this.classList.toggle("active");
  document.getElementById("dislike").classList.remove("active");
});

document.getElementById("dislike").addEventListener("click", function () {
  this.classList.toggle("active");
  document.getElementById("like").classList.remove("active");
});

// Display summary and extract facts
function displaySummaryAndFacts(summary) {
  document.getElementById("summary").innerText = summary;
  document.getElementById("summary-container").style.display = "block";

  // Extract facts from summary
  const facts = extractFacts(summary);
  displayFacts(facts);
}

function extractFacts(summary) {
  // Simple fact extraction - split by sentences and filter for meaningful ones
  const sentences = summary.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  return sentences.slice(0, 7); // Limit to 7 facts
}

function displayFacts(facts) {
  const factsList = document.getElementById("facts-list");
  factsList.innerHTML = "";

  facts.forEach((fact) => {
    const li = document.createElement("li");
    li.textContent = fact.trim();
    factsList.appendChild(li);
  });
}

// Show history modal
function showHistory() {
  // Get the history modal
  const historyModal = document.getElementById("history-modal");
  historyModal.style.display = "block";

  // Load history from storage
  loadHistory();
}

// Close history modal
function closeHistory() {
  document.getElementById("history-modal").style.display = "none";
}

// Load history from storage
function loadHistory() {
  chrome.storage.local.get("summaryHistory", (result) => {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";

    const history = result.summaryHistory || [];

    if (history.length === 0) {
      historyList.innerHTML = "<p class='no-history'>No history found.</p>";
      return;
    }

    // Create list items for each history entry
    history.forEach((entry, index) => {
      const listItem = document.createElement("div");
      listItem.className = "history-item";

      const title = document.createElement("div");
      title.className = "history-title";
      title.textContent = entry.title || "Untitled";

      const date = document.createElement("div");
      date.className = "history-date";
      date.textContent = new Date(entry.timestamp).toLocaleString();

      const actions = document.createElement("div");
      actions.className = "history-actions";

      const viewBtn = document.createElement("button");
      viewBtn.className = "history-btn";
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
      viewBtn.title = "View summary";
      viewBtn.addEventListener("click", () => {
        displaySummaryAndFacts(entry.summary);
        closeHistory();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "history-btn";
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.title = "Delete from history";
      deleteBtn.addEventListener("click", () => {
        removeHistoryItem(index);
      });

      actions.appendChild(viewBtn);
      actions.appendChild(deleteBtn);

      listItem.appendChild(title);
      listItem.appendChild(date);
      listItem.appendChild(actions);

      historyList.appendChild(listItem);
    });
  });
}

// Remove history item
function removeHistoryItem(index) {
  chrome.storage.local.get("summaryHistory", (result) => {
    const history = result.summaryHistory || [];

    if (index >= 0 && index < history.length) {
      history.splice(index, 1);
      chrome.storage.local.set({ summaryHistory: history }, () => {
        loadHistory(); // Reload the history list
      });
    }
  });
}

// Clear all history
function clearAllHistory() {
  if (confirm("Are you sure you want to clear all history?")) {
    chrome.storage.local.remove("summaryHistory", () => {
      loadHistory(); // Reload the history list
    });
  }
}

// Save summary to history
function saveSummaryToHistory(summary, pageTitle) {
  chrome.storage.local.get("summaryHistory", (result) => {
    const history = result.summaryHistory || [];

    // Add new entry to the beginning of the array
    history.unshift({
      title: pageTitle,
      summary: summary,
      timestamp: Date.now(),
    });

    // Limit history to 20 items
    const limitedHistory = history.slice(0, 20);

    chrome.storage.local.set({ summaryHistory: limitedHistory });
  });
}

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "displaySummary") {
    displaySummaryAndFacts(request.summary);

    // Get the page title
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      const pageTitle = tabs[0].title;

      // Cache the summary for this tab
      chrome.storage.local.set({ [tabId]: request.summary });

      // Save to history
      saveSummaryToHistory(request.summary, pageTitle);
    });
  }
});
