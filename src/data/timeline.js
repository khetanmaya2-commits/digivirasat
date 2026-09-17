/**
 * DigiVirasat 2.0 - Heritage Chronological & Preservation Timeline
 * Incorporates the actual Sheesh Mahal historical photographs:
 * - 1950: Gobindram Oodeyram historical postcard archive (Historical Context)
 * - 2009: Interior documentation survey (Historical Context)
 * - 2021: Standardized photometric recent reference (AWS Comparison Reference)
 */

export const HERITAGE_TIMELINE = [
  
  
  {
    year: '1950',
    era: 'Mid-20th Century',
    title: 'Archival View & Early Postcard Documentation',
    hindiTitle: '१९५०: ऐतिहासिक अभिलेख दृश्य',
    category: 'Historical Context',
    role: 'Historical Context',
    description:
      'Earliest available mid-century photographic documentation by Gobindram Oodeyram Studio, recording the full vaulting and mirror wall niches of the Glass Palace (Amber, Jaipur) prior to modern visitor cordons.',
    image: '/images/sheesh-mahal/sheesh-mahal-1950.jpg',
    source: 'Gobindram Oodeyram Studio, Amber Archives',
    isHistorical: true,
  },
  {
    year: '2009',
    era: 'Early 21st Century',
    title: 'Recorded Interior & Baseline Survey',
    hindiTitle: '२००९: प्रलेखित आंतरिक संरचना',
    category: 'Historical Context',
    role: 'Historical Context',
    description:
      'High-resolution interior survey capturing daylight reflection patterns and the integrity of Araish lime plaster around the arched wall niches without tourist occlusion.',
    image: '/images/sheesh-mahal/sheesh-mahal-2009.jpg',
    source: 'Archaeological Documentation Survey',
    isHistorical: true,
  },
  
  {
    year: '2021',
    era: 'Operational Baseline',
    title: 'Recent Reference Photograph (SM-01)',
    hindiTitle: '२०२१: हालिया संदर्भ छायाचित्र',
    category: 'AWS Comparison Reference',
    role: 'AWS Comparison Reference',
    description:
      'Standardized, high-dynamic-range calibrated photograph capturing contemporary surface conditions and visitor cordon geometry. Serves as the operational baseline against which visitor captures are compared by Amazon Rekognition.',
    image: '/images/sheesh-mahal/sheesh-mahal-2021.jpg',
    source: 'DigiVirasat Benchmark Registry (recent/amer-fort/SM-01-2021.jpg)',
    isHistorical: false,
    isBaseline: true,
    isReference: true,
  },
  {
    year: 'Today',
    era: 'Present Day (2026)',
    title: 'DigiVirasat 2.0 Living Digital Preservation',
    hindiTitle: 'वर्तमान: डिजिटल संरक्षण एवं तुलना',
    category: 'Active Preservation',
    role: 'Current Visitor Capture',
    description:
      'Real-time cloud preservation workflow: visitor captures are transferred to private Amazon S3, analyzed against the 2021 Reference by Amazon Rekognition, and permanently indexed in Amazon DynamoDB.',
    image: '/heritage/amer-fort/sheesh-mahal/sm-01/baseline-2026.jpg',
    source: 'DigiVirasat Cloud Platform Registry',
    isHistorical: false,
    isActive: true,
  },
];
