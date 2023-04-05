document.getElementById("summarize").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Add this event listener at the end of popup.js
  document.getElementById("copy").addEventListener("click", () => {
    const summaryText = document.getElementById("summary").innerText;
    navigator.clipboard.writeText(summaryText).then(() => {});
  });

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "displaySummary") {
    document.getElementById("summary").innerText = request.summary;
    document.getElementById("summary-container").style.display = "block";
  }
});

const port = chrome.runtime.connect({ name: "summary" });

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tabId = tabs[0].id;
  port.postMessage({ action: "getSummary", tabId });
});

port.onMessage.addListener((msg) => {
  if (msg.action === "displaySummary" && msg.summary) {
    document.getElementById("summary").innerText = msg.summary;
  }
});
