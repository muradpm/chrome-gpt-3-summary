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
