import { extractAll } from '../../../utils/domainExtractor.js';

export async function POST(request) {
  try {
    const { text, options = {} } = await request.json();

    if (!text || typeof text !== 'string') {
      return Response.json(
        { error: 'Text input is required' },
        { status: 400 }
      );
    }

    const results = extractAll(text, options);

    return Response.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Domain extraction error:', error);
    return Response.json(
      { error: 'Failed to extract domains' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    message: 'Domain Extractor API',
    endpoints: {
      POST: '/api/extract - Extract domains from text'
    },
    example: {
      text: 'Visit https://example.com and www.google.com for more info',
      options: {
        includeSubdomains: true,
        removeDuplicates: true,
        includeWww: false,
        sortResults: true
      }
    }
  });
}
