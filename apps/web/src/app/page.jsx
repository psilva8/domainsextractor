
import DomainExtractor from '../components/DomainExtractor';

export const meta = () => {
  return [
    { title: 'Domain Extractor - Extract domains from URLs and emails' },
    { name: 'description', content: 'Free domain extractor to quickly get domains from any list of URLs or emails. Works online, bulk paste supported.' },
    { name: 'keywords', content: 'domain extractor, URL parser, email domain, bulk domain extraction, free tool, online tool' },
    { property: 'og:title', content: 'Domain Extractor - Extract domains from URLs and emails' },
    { property: 'og:description', content: 'Free domain extractor to quickly get domains from any list of URLs or emails. Works online, bulk paste supported.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Domain Extractor - Extract domains from URLs and emails' },
    { name: 'twitter:description', content: 'Free domain extractor to quickly get domains from any list of URLs or emails. Works online, bulk paste supported.' },
  ];
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DomainExtractor />
    </div>
  );
}
