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
  let cleanedSummary = summary
    .replace(/\s{2,}/g, " ")
    .replace(/([.,!?])\s/g, "$1");

  // Insert line breaks between sentences
  cleanedSummary = cleanedSummary.replace(/([.!?]) (?=[A-Z])/g, "$1\n\n");

  // Insert additional line breaks between paragraphs and bullet points
  cleanedSummary = cleanedSummary.replace(/\n\n(?=[A-Z\d])/g, "\n\n\n");
  cleanedSummary = cleanedSummary.replace(/(\d+\.) (?=[A-Z])/g, "$1\n");

  return cleanedSummary;
}

async function summarizePage() {
  const apiKey = "your_api_key";
  const apiUrl = "https://api.openai.com/v1/engines/davinci/completions";

  const pageTitle = document.title;
  const pageHtml = document.documentElement.outerHTML;
  const truncatedText = truncateText(pageHtml, 4096);
  const prompt = `Please provide a concise, accurate, and informative summary of the following webpage titled "${pageTitle}":\n\n${truncatedText}`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      max_tokens: 200,
      n: 1,
      temperature: 0.7,
    }),
  });

  if (response.status === 400) {
    alert("Error: Bad request. Please check the input data.");
    return;
  }

  const data = await response.json();
  const summary = data.choices[0].text.trim();
  const cleanedSummary = postProcessSummary(summary);

  chrome.runtime.sendMessage({
    action: "displaySummary",
    summary: cleanedSummary,
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    summarizePage();
  }
});
