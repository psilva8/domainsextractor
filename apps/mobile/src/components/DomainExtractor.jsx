import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { extractAll } from '../utils/domainExtractor';

const { width } = Dimensions.get('window');

const DomainExtractor = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    includeSubdomains: true,
    removeDuplicates: true,
    includeWww: false,
    sortResults: true
  });
  const [expandedFaq, setExpandedFaq] = useState({});

  const handleExtract = useCallback(async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to extract domains from.');
      return;
    }

    setLoading(true);
    try {
      const extractedResults = extractAll(inputText, options);
      setResults(extractedResults);
    } catch (error) {
      Alert.alert('Error', 'Failed to extract domains. Please try again.');
      console.error('Extraction error:', error);
    } finally {
      setLoading(false);
    }
  }, [inputText, options]);

  const handleClear = () => {
    setInputText('');
    setResults(null);
  };

  const copyToClipboard = async (text, label) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied', `${label} copied to clipboard!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard.');
    }
  };

  const exportToCSV = async (data, filename) => {
    const csvContent = data.join('\n');
    try {
      await Clipboard.setStringAsync(csvContent);
      Alert.alert('Exported', `${filename} content copied to clipboard! Paste it into a text file and save as .csv`);
    } catch (error) {
      Alert.alert('Error', 'Failed to export CSV.');
    }
  };

  const exportToText = async (data, title) => {
    const content = `${title}\nGenerated: ${new Date().toLocaleDateString()}\n\n${data.map((item, index) => `${index + 1}. ${item}`).join('\n')}`;
    try {
      await Clipboard.setStringAsync(content);
      Alert.alert('Exported', 'Content copied to clipboard! You can paste and save as a text file.');
    } catch (error) {
      Alert.alert('Error', 'Failed to export content.');
    }
  };

  const exportToExcel = async (domains, urls) => {
    const headers = 'Type\tValue\tCount';
    const domainRows = domains.map(domain => `Domain\t${domain}\t1`);
    const urlRows = urls.map(url => `URL\t${url}\t1`);
    const summary = [`\nSummary`, `Total Domains\t${domains.length}`, `Total URLs\t${urls.length}`];
    
    const xlsContent = [headers, ...domainRows, ...urlRows, ...summary].join('\n');
    
    try {
      await Clipboard.setStringAsync(xlsContent);
      Alert.alert('Exported', 'Excel/Numbers content copied to clipboard! Paste into Excel, Numbers, or save as .xls file.');
    } catch (error) {
      Alert.alert('Error', 'Failed to export Excel data.');
    }
  };

  const toggleOption = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const exampleText = `Test cases: @https://blog.example.com:8080/path/to/page?query=123#section
ftp://files.server.net/pub/file.txt
www.no-protocol.com/path
Email me at contact@example.com but visit api-v2.service.com and subdomain.test-site.org.
Check these: (parentheses.com) and "quotes.net" and end-punctuation.org!`;

  const formatOutput = (items) => {
    return items.join('\n');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={{ 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: 20,
        }}>
          <Text style={{ fontSize: 48 }}>🔍</Text>
        </View>
        <Text style={styles.brandTitle}>Domain Extractor</Text>
        <Text style={styles.title}>Extract domains and URLs from any text content with precision</Text>
      </View>

      <View style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <View style={{ 
            width: 40, 
            height: 40, 
            backgroundColor: '#f1f5f9', 
            borderRadius: 12, 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginRight: 16 
          }}>
            <Text style={{ fontSize: 20 }}>📝</Text>
          </View>
          <Text style={styles.sectionTitle}>Input Text</Text>
        </View>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Paste your text here..."
          multiline
          textAlignVertical="top"
        />
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setInputText(exampleText)}
          >
            <Text style={styles.secondaryButtonText}>Load Example</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleClear}
          >
            <Text style={styles.dangerButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Options</Text>
        
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => toggleOption('includeSubdomains')}
        >
          <View style={styles.checkbox}>
            {options.includeSubdomains && <View style={styles.checkboxInner} />}
          </View>
          <Text style={styles.optionText}>Include subdomains</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => toggleOption('includeWww')}
        >
          <View style={styles.checkbox}>
            {options.includeWww && <View style={styles.checkboxInner} />}
          </View>
          <Text style={styles.optionText}>Include www prefix</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => toggleOption('removeDuplicates')}
        >
          <View style={styles.checkbox}>
            {options.removeDuplicates && <View style={styles.checkboxInner} />}
          </View>
          <Text style={styles.optionText}>Remove duplicates</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => toggleOption('sortResults')}
        >
          <View style={styles.checkbox}>
            {options.sortResults && <View style={styles.checkboxInner} />}
          </View>
          <Text style={styles.optionText}>Sort results</Text>
        </TouchableOpacity>
      </View>

      {results && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Results</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{results.statistics.totalDomains}</Text>
              <Text style={styles.statLabel}>Domains</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{results.statistics.totalUrls}</Text>
              <Text style={styles.statLabel}>URLs</Text>
            </View>
          </View>

          <View style={styles.exportAllContainer}>
            <TouchableOpacity
              style={styles.exportAllButton}
              onPress={() => Alert.alert(
                'Export All Results',
                'Choose export format for all data:',
                [
                  { text: '📄 All as CSV', onPress: () => exportToCSV([...results.domains.map(d => `Domain,${d}`), ...results.urls.map(u => `URL,${u}`)], 'all_results.csv') },
                  { text: '📋 All as Text/Print', onPress: () => exportToText([...results.domains, ...results.urls], 'All Extracted Results') },
                  { text: '📊 All as Excel/Numbers', onPress: () => exportToExcel(results.domains, results.urls) },
                  { text: 'Cancel', style: 'cancel' }
                ]
              )}
            >
              <Text style={styles.exportAllButtonText}>📦 Export All Results</Text>
            </TouchableOpacity>
          </View>

            {results.domains.length > 0 && (
            <View style={styles.resultSection}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Domains ({results.domains.length})</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => copyToClipboard(formatOutput(results.domains), 'Domains')}
                  >
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.exportButton}
                    onPress={() => Alert.alert(
                      'Export Domains',
                      'Choose export format:',
                      [
                        { text: '📄 CSV', onPress: () => exportToCSV(results.domains, 'domains.csv') },
                        { text: '📋 Text/Print', onPress: () => exportToText(results.domains, 'Extracted Domains') },
                        { text: '📊 Excel/Numbers', onPress: () => exportToExcel(results.domains, []) },
                        { text: 'Cancel', style: 'cancel' }
                      ]
                    )}
                  >
                    <Text style={styles.exportButtonText}>Export</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TextInput
                style={styles.resultTextInput}
                value={formatOutput(results.domains)}
                multiline
                editable={false}
                textAlignVertical="top"
              />
            </View>
          )}

          {results.urls.length > 0 && (
            <View style={styles.resultSection}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>URLs ({results.urls.length})</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => copyToClipboard(formatOutput(results.urls), 'URLs')}
                  >
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.exportButton}
                    onPress={() => Alert.alert(
                      'Export URLs',
                      'Choose export format:',
                      [
                        { text: '📄 CSV', onPress: () => exportToCSV(results.urls, 'urls.csv') },
                        { text: '📋 Text/Print', onPress: () => exportToText(results.urls, 'Extracted URLs') },
                        { text: '📊 Excel/Numbers', onPress: () => exportToExcel([], results.urls) },
                        { text: 'Cancel', style: 'cancel' }
                      ]
                    )}
                  >
                    <Text style={styles.exportButtonText}>Export</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TextInput
                style={styles.resultTextInput}
                value={formatOutput(results.urls)}
                multiline
                editable={false}
                textAlignVertical="top"
              />
            </View>
          )}

          {results.domains.length === 0 && results.urls.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No domains or URLs found in the provided text.</Text>
            </View>
          )}
        </View>
      )}

      {/* Extract Domains Button - Always visible in Results area */}
      <View style={styles.section}>
        <View style={{ alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, loading && styles.disabledButton, { paddingHorizontal: 32, paddingVertical: 12 }]}
            onPress={handleExtract}
            disabled={!inputText.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.primaryButtonText, { fontSize: 18 }]}>Extract Domains</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Features Overview Section */}
      <View style={{ marginTop: 40, paddingHorizontal: 16 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>Features Overview</Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Single Mode:</Text>
            <Text style={{ color: '#6b7280', fontSize: 14, lineHeight: 20 }}>
              • Extract domains from individual URLs, emails, or hostnames{'\n'}
              • Real-time results with copy-to-clipboard functionality{'\n'}
              • Handles all the cases: subdomains, TLDs, emails, IPs, localhost, etc.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Batch Processing:</Text>
            <Text style={{ color: '#6b7280', fontSize: 14, lineHeight: 20 }}>
              • Process up to 100 URLs/emails at once{'\n'}
              • Summary statistics (total, valid, failed){'\n'}
              • Export results to CSV{'\n'}
              • Clean table view of all results
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>🎯 What It Extracts:</Text>
            <Text style={{ color: '#6b7280', fontSize: 14, lineHeight: 20 }}>
              • Hostname: Full hostname (e.g., blog.example.co.uk){'\n'}
              • Registrable Domain: Main domain (e.g., example.co.uk){'\n'}
              • Subdomain: Subdomain part (e.g., blog){'\n'}
              • TLD: Top-level domain (e.g., co.uk){'\n'}
              • Status Flags: Email, IP, localhost, validity
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>💪 Handles All Edge Cases:</Text>
            <Text style={{ color: '#059669', fontSize: 14, lineHeight: 20 }}>
              ✅ URLs: https://blog.example.co.uk/path?query=1{'\n'}
              ✅ Emails: jane.doe@company.org{'\n'}
              ✅ IP addresses: 127.0.0.1, IPv6{'\n'}
              ✅ Localhost: http://localhost:3000{'\n'}
              ✅ Complex TLDs: co.uk, com.au, etc.{'\n'}
              ✅ Malformed inputs with proper error handling
            </Text>
          </View>
        </View>
      </View>

      {/* FAQ Section */}
      <View style={{ marginTop: 40, paddingHorizontal: 16, marginBottom: 20 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{ width: 48, height: 48, backgroundColor: '#4f46e5', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 24 }}>❓</Text>
            </View>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1f2937', textAlign: 'center', marginBottom: 8 }}>
              Frequently Asked Questions
            </Text>
            <Text style={{ color: '#6366f1', textAlign: 'center', fontSize: 14 }}>
              Everything you need to know about our domain extraction tool
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            {[
              {
                id: 'online',
                icon: '🌐',
                question: 'Domain Extractor Online',
                answer: 'Yes! Our domain extractor works completely online in your browser. No downloads, installations, or signup required. Simply paste your text and extract domains instantly from any device with internet access.'
              },
              {
                id: 'email', 
                icon: '📧',
                question: 'Domain Email Extractor',
                answer: 'Absolutely! Our tool intelligently extracts domains from email addresses. Paste emails like "user@example.com" and get clean domains like "example.com" with proper validation and formatting.'
              },
              {
                id: 'name',
                icon: '🔗', 
                question: 'Domain Name Extractor',
                answer: 'Extract clean domain names from any text containing URLs, links, or domain references. Handles complex cases like subdomains, ports, paths, and removes unwanted characters automatically.'
              },
              {
                id: 'extension',
                icon: '🧩',
                question: 'Domain Extractor Chrome Extension', 
                answer: 'While we don\'t currently offer a Chrome extension, our web tool works perfectly in any browser! Bookmark our page for quick access, or use our mobile-responsive design on any device.'
              }
            ].map((faq) => (
              <View key={faq.id} style={{ backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
                  onPress={() => setExpandedFaq(prev => ({ ...prev, [faq.id]: !prev[faq.id] }))}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 20, marginRight: 12 }}>{faq.icon}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', flex: 1 }}>
                      {faq.question}
                    </Text>
                  </View>
                  <Text style={{ 
                    fontSize: 16, 
                    color: '#6366f1',
                    transform: [{ rotate: expandedFaq[faq.id] ? '180deg' : '0deg' }]
                  }}>
                    ▼
                  </Text>
                </TouchableOpacity>
                {expandedFaq[faq.id] && (
                  <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ color: '#64748b', fontSize: 14, lineHeight: 20 }}>
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={{ marginTop: 16, backgroundColor: '#4f46e5', borderRadius: 12, padding: 16 }}>
            <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center', marginBottom: 4 }}>💡 Pro Tip</Text>
            <Text style={{ color: '#c7d2fe', fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
              Use our export features to save results as CSV, PDF, or Excel files for easy data management and sharing.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(30, 41, 59, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    height: 120,
    fontSize: 16,
    color: '#111827',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#fef2f2',
    flex: 1,
  },
  dangerButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  resultSection: {
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  copyButton: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyButtonText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '500',
  },
  exportButton: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  exportButtonText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '500',
  },
  exportAllContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  exportAllButton: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exportAllButtonText: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: '600',
  },
  resultTextInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    height: 100,
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#111827',
  },
  noResultsContainer: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  noResultsText: {
    color: '#92400e',
    textAlign: 'center',
  },
});

export default DomainExtractor;
