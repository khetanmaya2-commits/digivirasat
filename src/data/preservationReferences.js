/**
 * DigiVirasat 2.0 - Centralized Preservation Reference & Historical Context Configuration
 * Explicit data model separating:
 * - historical-context: 1950, 2000 (Storytelling only, NOT passed to AWS)
 * - reference: 2021 (Active operational baseline for AWS Rekognition)
 * - current-capture: Today (Uploaded dynamically via S3 presigned PUT)
 */

export const PRESERVATION_REFERENCES = {
  'SM-01': {
    elementId: 'SM-01',
    elementName: 'East Mirror Wall',
    elementHindi: 'पूर्वी शीशा दीवार',
    monumentId: 'amer-fort',
    monumentName: 'Amer Fort',
    chamber: 'Sheesh Mahal (Jai Mandir)',
    chamberHindi: 'शीश महल (जय मंदिर)',
    referenceYear: 2021,
    referenceLabel: '2021 Reference',
    referenceTitle: 'Recent Reference',
    referenceImage: '/images/sheesh-mahal/sheesh-mahal-2021.jpg',
    referenceS3Key: 'recent/amer-fort/SM-01-2021.jpg',
    referenceRole: 'Active Reference',
    referenceDescription:
      'The latest reference photograph used as the visual baseline for current preservation comparison.',
    timelineItems: [
      {
        year: 1950,
        type: 'historical-context',
        role: 'Historical Context',
        badge: 'HISTORICAL CONTEXT',
        title: 'Archival View',
        hindiTitle: 'ऐतिहासिक अभिलेख',
        description: 'An archival view preserving the visual memory of Sheesh Mahal.',
        image: '/images/sheesh-mahal/sheesh-mahal-1950.jpg',
        detailedStory:
          'Captured in the mid-20th century by the renowned Gobindram Oodeyram Studio of Jaipur, this vintage postcard preserves the early photographic memory of the Glass Palace (Sheesh Mahal). It documents the original concave and convex mirror inlays and floral wall niches before the installation of modern tourist barriers and protective ropes.',
        archivalMetadata: 'Gobindram Oodeyram Studio &bull; Amer Historical Postcard Archive &bull; Circa 1950',
      },
      {
        year: 2000,
        type: 'historical-context',
        role: 'Historical Context',
        badge: 'HISTORICAL CONTEXT',
        title: 'Recorded Interior',
        hindiTitle: 'दर्ज किया गया आंतरिक दृश्य',
        description: 'A historical visual record showing the interior and decorative details of Sheesh Mahal.',
        image: '/images/sheesh-mahal/sheesh-mahal-2000.jpg',
        detailedStory:
          'A comprehensive photographic survey conducted at the turn of the millennium. This high-resolution interior documentation recorded the ambient daylight patterns illuminating the Thikri mirror arrays and the fine relief carvings on the Makrana marble plinths, establishing a vital transitional record before 21st-century conservation interventions.',
        archivalMetadata: 'Archaeological Documentation Survey &bull; Millennium Heritage Archive &bull; 2000',
      },
      {
        year: 2021,
        type: 'reference',
        role: 'Active Reference',
        badge: 'ACTIVE REFERENCE',
        title: 'Recent Reference',
        hindiTitle: 'हालिया संदर्भ',
        description: 'The latest reference photograph used as the visual baseline for current preservation comparison.',
        image: '/images/sheesh-mahal/sheesh-mahal-2021.jpg',
        detailedStory:
          'A standardized, high-dynamic-range calibrated photograph capturing contemporary surface conditions, ambient lighting response, and mirror foil alignments. In the DigiVirasat architecture, this image serves as the active operational baseline against which current visitor captures are evaluated.',
        archivalMetadata: 'Standardized Photometric Benchmark Archive &bull; Active Operational Baseline &bull; 2021',
      },
    ],
    visitorCapture: {
      year: 'Today',
      type: 'current-capture',
      role: 'Visitor Capture',
      badge: 'VISITOR CAPTURE',
      title: 'Current Documentation',
      hindiTitle: 'वर्तमान आगंतुक छायाचित्र',
      description: 'Document what the heritage element looks like today and contribute to its living preservation archive.',
    },
  },
};

export function getElementReference(elementId = 'SM-01') {
  return PRESERVATION_REFERENCES[elementId] || PRESERVATION_REFERENCES['SM-01'];
}
