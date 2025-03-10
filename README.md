<<<<<<< HEAD
<p align="center">
  <img alt="GPT-4 Suite - Summarize everything!" src="./preview/public/gpt-suite.png" width="128" height="128">
  <h1 align="center">GPT Summary</h1>
</p>

<p align="center">
  A powerful Chrome extension that uses ChatGPT to generate summaries of webpages.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#usage"><strong>Usage</strong></a> ·
  <a href="#development"><strong>Development</strong></a>
</p>
<br/>

## Features

- **Smart Summarization**

  - Intelligent webpage text extraction
  - ChatGPT-powered summary generation
  - Automatic text truncation for long content
  - Post-processing for enhanced readability

- **Modern UI/UX**

  - Clean and intuitive interface
  - Easy-to-use popup window
  - Loading states and error handling
  - Dark mode support

- **Security & Performance**
  - Secure API key management
  - Efficient text processing
  - Chrome Storage integration
  - Background script optimization

## Installation

1. Clone this repository:

```bash
git clone https://github.com/muradpm/chat-gpt3-summary.git
```

2. Configure the extension:

   - Add your OpenAI API key to extension settings: `OPENAI_API_KEY=your_key_here`

3. Load in Chrome:
   - Open Chrome Extensions page (`chrome://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the cloned repository folder

## Usage

1. Click the extension icon in your Chrome toolbar
2. Navigate to any webpage you want to summarize
3. Click the "Summarize" button
4. View your generated summary with key facts and insights

## Development

### Project Structure

```
├── manifest.json        # Extension configuration
├── popup.html          # Main popup interface
├── styles/
│   └── popup.css       # UI styling
├── scripts/
│   ├── content.js      # Content script
│   ├── popup.js        # Popup logic
│   └── background.js   # Background worker
└── icons/
    └── icon.png        # Extension icon
```

### Dependencies

- [OpenAI API](https://platform.openai.com/docs/introduction) - For GPT-powered summarization

### Running Locally

1. Make required changes to the code
2. Reload the extension in Chrome
3. Test your changes
=======
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
>>>>>>> 87edad9c5960e094a2c7d5193977368224fb1e38

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.

## Contact

<<<<<<< HEAD
Created by [@abdulkadyr0v](https://twitter.com/abdulkadyr0v)
=======
If you have any questions, feel free to reach out to me:
>>>>>>> 87edad9c5960e094a2c7d5193977368224fb1e38

- [LinkedIn](https://www.linkedin.com/in/abdulkadyr0v/)
- [Twitter](https://twitter.com/abdulkadyr0v)
