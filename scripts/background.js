// Initialize storage when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("GPT-4 Webpage Summarizer installed");

  // Set default configuration if not already set
  chrome.storage.local.get("config", (result) => {
    if (!result.config) {
      const defaultConfig = {
        apiKey: "YOUR_API_KEY_HERE",
        model: "gpt-4o-mini",
        maxTokens: 800,
        temperature: 0.5,
      };
      chrome.storage.local.set({ config: defaultConfig });
    }
  });
});

// Handle messages from popup and content scripts
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    if (msg.action === "getSummary") {
      const tabId = msg.tabId;
      chrome.storage.local.get(tabId.toString(), (data) => {
        port.postMessage({ action: "displaySummary", summary: data[tabId] });
      });
    } else if (msg.action === "saveSummary") {
      const tabId = msg.tabId;
      const summary = msg.summary;
      chrome.storage.local.set({ [tabId]: summary });
    }
  });
});

// Listen for tab updates to clear cached summaries when navigating to new pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // Clear the cached summary for this tab
    chrome.storage.local.remove(tabId.toString());
  }
});

// Context menu for summarizing selected text
chrome.contextMenus?.create({
  id: "summarizeSelection",
  title: "Summarize selection with GPT-4",
  contexts: ["selection"],
});

chrome.contextMenus?.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarizeSelection") {
    // TODO: Implement summarizing selected text
    console.log("Selected text:", info.selectionText);
  }
});
