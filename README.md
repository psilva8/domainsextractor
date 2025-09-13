# Domain Extractor

A powerful cross-platform application for extracting domains and URLs from text content. Available as both a web application and mobile app.

## Features

- 🔍 **Smart Domain Extraction**: Automatically detects and extracts domains from any text
- 🌐 **URL Detection**: Finds complete URLs with protocols
- ⚙️ **Flexible Options**: 
  - Include/exclude subdomains
  - Include/exclude www prefixes
  - Remove duplicates
  - Sort results alphabetically
- 📱 **Cross-Platform**: Web and mobile applications
- 📊 **Statistics**: Get counts and analysis of extracted domains
- 📋 **Copy to Clipboard**: Easy copying of results
- 💾 **Multiple Export Formats**: List, CSV, and JSON formats

## Getting Started

### Web Application

1. Navigate to the web app directory:
   ```bash
   cd apps/web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit the application

### Mobile Application

1. Navigate to the mobile app directory:
   ```bash
   cd apps/mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Use the Expo Go app to scan the QR code or run on simulator

## Usage

### Basic Usage

1. **Input Text**: Paste or type text containing domains and URLs
2. **Configure Options**: Choose extraction preferences
3. **Extract**: Click/tap the "Extract Domains" button
4. **View Results**: See extracted domains, URLs, and statistics
5. **Copy Results**: Use copy buttons to save results to clipboard

### Example Input

```
Check out these websites: https://www.google.com, https://github.com/user/repo, 
www.stackoverflow.com, and visit example.com for more information. 
You can also find resources at docs.microsoft.com and developer.mozilla.org.
```

### Example Output

**Domains:**
- example.com
- github.com
- google.com
- docs.microsoft.com
- developer.mozilla.org
- stackoverflow.com

**URLs:**
- https://www.google.com
- https://github.com/user/repo

## Configuration Options

- **Include Subdomains**: Keep subdomains like `docs.microsoft.com` vs just `microsoft.com`
- **Include WWW**: Preserve `www.` prefixes in results
- **Remove Duplicates**: Eliminate duplicate entries
- **Sort Results**: Alphabetically sort the extracted domains

## API Usage (Web Only)

The web application includes a REST API for programmatic access:

### POST /api/extract

Extract domains from text programmatically.

**Request Body:**
```json
{
  "text": "Your text content here",
  "options": {
    "includeSubdomains": true,
    "removeDuplicates": true,
    "includeWww": false,
    "sortResults": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "domains": ["example.com", "google.com"],
    "urls": ["https://example.com", "https://google.com"],
    "statistics": {
      "totalDomains": 2,
      "totalUrls": 2,
      "uniqueDomains": 2,
      "domainOccurrences": {
        "example.com": 1,
        "google.com": 1
      }
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Technology Stack

### Web Application
- **Framework**: React with React Router v7
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Build Tool**: Vite

### Mobile Application
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **UI Components**: Native React Native components
- **Clipboard**: Expo Clipboard API

## Project Structure

```
Domain Extractor/
├── apps/
│   ├── web/                 # Web application
│   │   ├── src/
│   │   │   ├── app/         # App routes and pages
│   │   │   ├── components/  # React components
│   │   │   └── utils/       # Utility functions
│   │   └── package.json
│   └── mobile/              # Mobile application
│       ├── src/
│       │   ├── app/         # App screens
│       │   ├── components/  # React Native components
│       │   └── utils/       # Utility functions
│       └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Features Overview

**Single Mode:**

Extract domains from individual URLs, emails, or hostnames
Real-time results with copy-to-clipboard functionality
Handles all the cases you mentioned: subdomains, TLDs, emails, IPs, localhost, etc.

**Batch Processing:**

Process up to 100 URLs/emails at once
Summary statistics (total, valid, failed)
Export results to CSV
Clean table view of all results

**Backend API:**

POST /api/extract - Single domain extraction
GET /api/extract?input=... - Query parameter support
POST /api/extract/batch - Batch processing

🎯 **What It Extracts**
- Hostname: Full hostname (e.g., blog.example.co.uk)
- Registrable Domain: Main domain (e.g., example.co.uk)
- Subdomain: Subdomain part (e.g., blog)
- TLD: Top-level domain (e.g., co.uk)
- Status Flags: Email, IP, localhost, validity

💪 **Handles All Edge Cases**
- ✅ URLs: https://blog.example.co.uk/path?query=1
- ✅ Emails: jane.doe@company.org
- ✅ IP addresses: 127.0.0.1, IPv6
- ✅ Localhost: http://localhost:3000
- ✅ Complex TLDs: co.uk, com.au, etc.
- ✅ Malformed inputs with proper error handling
