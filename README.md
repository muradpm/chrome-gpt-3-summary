# ChatGPT Webpage Summarizer

This is a Chrome extension that uses ChatGPT to generate summaries of webpages. It extracts the text from a webpage, sends it to the ChatGPT API, and displays a generated summary in a popup window.

## Features

- Summarizes webpages with the click of a button
- Clean and easy-to-use UI
- Automatic text truncation for long webpages
- Post-processing to improve readability

## Installation

1. Clone this repository to your local machine.

2. Open the Chrome Extensions page.

3. Enable Developer mode by clicking the toggle in the top-right corner.

4. Click "Load unpacked" and select the cloned repository folder.

## Usage

1. Clone the repository: git clone https://github.com/muradpm/chat-gpt3-summary.git

2. Replace `your_api_key'` in the `content.js` file with your actual OpenAI API key.

3. Navigate to a webpage you want to summarize.

4. Click on the ChatGPT Webpage Summarizer icon in the top-right corner of your browser.

5. Click the "Summarize" button to generate a summary of the webpage.

## Files and Directories

- `popup.html`: HTML file for the popup window.
- `popup.css`: CSS file for the popup window.
- `manifest.json`: Manifest file for the Chrome extension.
- `content.js`: JavaScript file containing the main functionality.
- `popup.js`: JavaScript file for the popup window.
- `background.js`: Background script for the extension.

## API Key
- Don't forget to replace the apiKey variable in the content.js file with your own ChatGPT API key.

## Dependencies
- ChatGPT API: https://platform.openai.com/docs/introduction

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.

## Contact

If you have any questions, feel free to reach out to me:

- LinkedIn: (https://www.linkedin.com/in/abdulkadyr0v/)
- Twitter: (https://twitter.com/abdulkadyr0v)
