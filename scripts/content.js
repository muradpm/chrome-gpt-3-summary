// Content script for the extension
// This script is injected into web pages to extract and summarize content

function splitTextIntoSections(text, maxSectionLength) {
  const sections = [];
  let sectionStart = 0;

  while (sectionStart < text.length) {
    const sectionEnd = sectionStart + maxSectionLength;
    const lastSpaceIndex = text.lastIndexOf(" ", sectionEnd);
    const section = text.slice(sectionStart, lastSpaceIndex);
    sections.push(section);
    sectionStart = lastSpaceIndex + 1;
  }

  return sections;
}

function truncateText(html, maxLength) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  let outputText = "";

  function traverse(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      outputText += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (["H1", "H2", "H3"].includes(node.tagName)) {
        outputText += "\n\n• " + node.textContent;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          traverse(node.childNodes[i]);
        }
      }
    }
  }

  traverse(doc.body);

  if (outputText.length > maxLength) {
    const lastSpaceIndex = outputText.lastIndexOf(" ", maxLength);
    if (lastSpaceIndex !== -1) {
      outputText = outputText.slice(0, lastSpaceIndex);
    }
  }

  return outputText;
}

function postProcessSummary(summary) {
  // Remove extra spaces and fix punctuation
  let cleanedSummary = summary.replace(/\s{2,}/g, " ").replace(/([.,!?])\s/g, "$1");

  // Insert line breaks between sentences
  cleanedSummary = cleanedSummary.replace(/([.!?]) (?=[A-Z])/g, "$1\n\n");

  // Insert additional line breaks between paragraphs and bullet points
  cleanedSummary = cleanedSummary.replace(/\n\n(?=[A-Z\d])/g, "\n\n\n");
  cleanedSummary = cleanedSummary.replace(/(\d+\.) (?=[A-Z])/g, "$1\n");

  return cleanedSummary;
}

async function summarizePage() {
  try {
    // Get configuration from storage
    chrome.storage.local.get("config", async (result) => {
      const config = result.config || {
        apiKey: "YOUR_API_KEY_HERE",
        model: "gpt-4o-mini",
        maxTokens: 800,
        temperature: 0.5,
      };

      // Check if API key is set
      if (!config.apiKey || config.apiKey === "YOUR_API_KEY_HERE") {
        chrome.runtime.sendMessage({
          action: "displaySummary",
          summary:
            "Please set your OpenAI API key in the extension settings to use this feature.",
        });
        return;
      }

      const apiUrl = "https://api.openai.com/v1/chat/completions";

      const pageTitle = document.title;
      const pageHtml = document.documentElement.outerHTML;
      const truncatedText = truncateText(pageHtml, 4096);

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model || "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that provides concise, accurate, and informative summaries of webpages. Your summary should be well-structured with a main summary paragraph followed by key facts.",
              },
              {
                role: "user",
                content: `Please provide a concise, accurate, and informative summary of the following webpage titled "${pageTitle}":\n\n${truncatedText}\n\nFormat your response as a cohesive summary paragraph followed by 6-8 key facts from the page. Each fact should be a single sentence.`,
              },
            ],
            max_tokens: config.maxTokens || 800,
            temperature: config.temperature || 0.5,
          }),
        });

        if (response.status === 400) {
          chrome.runtime.sendMessage({
            action: "displaySummary",
            summary: "Error: Bad request. Please check your API key and settings.",
          });
          return;
        }

        if (response.status === 401) {
          chrome.runtime.sendMessage({
            action: "displaySummary",
            summary:
              "Error: Invalid API key. Please check your API key in the extension settings.",
          });
          return;
        }

        const data = await response.json();
        const summary = data.choices[0].message.content.trim();
        const cleanedSummary = postProcessSummary(summary);

        chrome.runtime.sendMessage({
          action: "displaySummary",
          summary: cleanedSummary,
        });
      } catch (error) {
        chrome.runtime.sendMessage({
          action: "displaySummary",
          summary: `Error: ${error.message}. Please try again later.`,
        });
      }
    });
  } catch (error) {
    chrome.runtime.sendMessage({
      action: "displaySummary",
      summary: `Error: ${error.message}. Please try again later.`,
    });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    summarizePage();
  }
});
