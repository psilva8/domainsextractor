/**
 * Domain Extractor Utility
 * Extracts domains and URLs from text content
 */

// Improved regular expressions for better domain and URL matching
const domainRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?=\s|$|[^\w.-]|[.][^a-zA-Z])/gi;
const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;

/**
 * Extract domains from text
 * @param {string} text - Input text to extract domains from
 * @param {Object} options - Configuration options
 * @returns {Array} Array of unique domains
 */
export function extractDomains(text, options = {}) {
  const {
    includeSubdomains = true,
    removeDuplicates = true,
    includeWww = false,
    sortResults = true
  } = options;

  if (!text || typeof text !== 'string') {
    return [];
  }

  // More precise pattern matching with proper word boundaries and protocol support
  const domainPattern = /(?:(?:https?|ftp|ftps):\/\/)?(?:www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?=\s|$|[^\w.-]|[.][^a-zA-Z]|\/|:|\?|#)/gi;
  
  const domains = [];
  let match;
  
  // Reset regex for global matching
  domainPattern.lastIndex = 0;
  
  while ((match = domainPattern.exec(text)) !== null) {
    let domain = match[0];
    
    // Skip if this looks like an email address
    const beforeMatch = text.substring(Math.max(0, match.index - 1), match.index);
    if (beforeMatch === '@') continue;
    
    // Remove protocols (including FTP)
    domain = domain.replace(/^(?:https?|ftp|ftps):\/\//, '');
    
    // Handle www prefix
    if (!includeWww) {
      domain = domain.replace(/^www\./, '');
    }
    
    // Clean up trailing punctuation and paths
    domain = domain.replace(/[.,;:!?)\]}]+$/, ''); // Remove trailing punctuation
    domain = domain.split('/')[0].split(':')[0].split('?')[0].split('#')[0];
    
    // Validate domain structure
    const domainParts = domain.split('.');
    const isValid = domainParts.length >= 2 && 
                   domainParts.every(part => part.length > 0 && /^[a-zA-Z0-9-]+$/.test(part) && 
                                    !part.startsWith('-') && !part.endsWith('-')) &&
                   /^[a-zA-Z]{2,}$/.test(domainParts[domainParts.length - 1]);
    
    // Additional validation: reject common file extensions
    const lastPart = domainParts[domainParts.length - 1].toLowerCase();
    const fileExtensions = ['txt', 'pdf', 'doc', 'docx', 'jpg', 'png', 'gif', 'zip', 'exe', 'mp3', 'mp4', 'avi', 'csv', 'xlsx', 'ppt'];
    const isFileExtension = fileExtensions.includes(lastPart);
    
    if (isValid && !isFileExtension) {
      // Handle subdomains
      if (!includeSubdomains && domainParts.length > 2) {
        domain = domainParts.slice(-2).join('.');
      }
      
      domains.push(domain.toLowerCase());
    }
  }

  // Remove duplicates
  let result = removeDuplicates ? [...new Set(domains)] : domains;

  // Sort results
  if (sortResults) {
    result.sort();
  }

  return result;
}

/**
 * Extract full URLs from text
 * @param {string} text - Input text to extract URLs from
 * @param {Object} options - Configuration options
 * @returns {Array} Array of URLs
 */
export function extractUrls(text, options = {}) {
  const { removeDuplicates = true, sortResults = true } = options;

  if (!text || typeof text !== 'string') {
    return [];
  }

  // Improved URL regex that handles more protocols and edge cases
  const urlPattern = /(?:^|[^@])((?:https?|ftp|ftps):\/\/[^\s<>"{}|\\^`[\]()]+)/gi;
  const matches = [];
  let match;
  
  urlPattern.lastIndex = 0;
  
  while ((match = urlPattern.exec(text)) !== null) {
    let url = match[1]; // Use capture group to exclude the non-@ character
    
    // Clean up trailing punctuation
    url = url.replace(/[.,;:!?)\]}>]+$/, '');
    
    // Validate URL structure
    try {
      new URL(url);
      matches.push(url);
    } catch (e) {
      // Invalid URL, skip it
    }
  }

  // Remove duplicates
  let urls = removeDuplicates ? [...new Set(matches)] : matches;

  // Sort results
  if (sortResults) {
    urls.sort();
  }

  return urls;
}

/**
 * Extract both domains and URLs with metadata
 * @param {string} text - Input text to extract from
 * @param {Object} options - Configuration options
 * @returns {Object} Object containing domains, urls, and statistics
 */
export function extractAll(text, options = {}) {
  const domains = extractDomains(text, options);
  const urls = extractUrls(text, options);

  // Get domain statistics
  const domainStats = domains.reduce((stats, domain) => {
    const occurrences = (text.toLowerCase().match(new RegExp(domain.replace(/\./g, '\\.'), 'gi')) || []).length;
    stats[domain] = occurrences;
    return stats;
  }, {});

  return {
    domains,
    urls,
    statistics: {
      totalDomains: domains.length,
      totalUrls: urls.length,
      uniqueDomains: domains.length,
      domainOccurrences: domainStats
    }
  };
}

/**
 * Validate if a string is a valid domain
 * @param {string} domain - Domain to validate
 * @returns {boolean} True if valid domain
 */
export function isValidDomain(domain) {
  if (!domain || typeof domain !== 'string') return false;
  
  const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainPattern.test(domain) && domain.includes('.');
}

/**
 * Format extracted results for display
 * @param {Array} domains - Array of domains
 * @param {string} format - Output format ('list', 'csv', 'json')
 * @returns {string} Formatted output
 */
export function formatResults(domains, format = 'list') {
  if (!Array.isArray(domains)) return '';
  
  switch (format.toLowerCase()) {
    case 'csv':
      return domains.join(', ');
    case 'json':
      return JSON.stringify(domains, null, 2);
    case 'list':
    default:
      return domains.join('\n');
  }
}
