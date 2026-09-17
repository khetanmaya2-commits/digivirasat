/**
 * DigiVirasat 2.0 - Conservation Command Center Dashboard API
 * Designed with full extensibility for future GET /dashboard/summary and GET /dashboard/analyses endpoints.
 * Provides transparent baseline monitoring records when backend aggregation routes are pending.
 */

import { apiRequest, isApiConfigured } from './apiClient';

/**
 * Fetch high-level conservation metrics across heritage sites
 */
export async function getDashboardSummary() {
  if (isApiConfigured()) {
    try {
      // Future API Gateway route
      return await apiRequest('/dashboard/summary', { method: 'GET' }, 5000);
    } catch {
      // Fallback to baseline metrics when backend summary aggregation endpoint is not yet provisioned
    }
  }

  // Baseline monitoring data clearly flagged as architectural baseline
  return {
    isLive: false,
    source: 'Baseline Conservation Registry',
    totalElements: 5,
    totalAnalyses: 18,
    activeAlerts: 3,
    monitoredSites: 4,
    healthDistribution: {
      stable: 3,
      moderate: 1,
      highPriority: 1,
    },
    avgPriorityScore: 48,
  };
}

/**
 * Fetch list of recent preservation analysis observations
 */
export async function getDashboardAnalyses() {
  if (isApiConfigured()) {
    try {
      // Future API Gateway route
      const response = await apiRequest('/dashboard/analyses', { method: 'GET' }, 5000);
      if (Array.isArray(response)) {
        return { isLive: true, records: response };
      }
    } catch {
      // Fallback to baseline observations
    }
  }

  // Baseline records for the Amer Fort & Sheesh Mahal demo
  return {
    isLive: false,
    source: 'Conservation Archive & Baseline Observation Log',
    records: [
      {
        analysisId: 'DV-ANL-2026-0891',
        elementId: 'SM-01',
        elementName: 'East Mirror Wall',
        elementHindi: 'पूर्वी शीशा दीवार',
        monumentName: 'Amer Fort, Jaipur',
        condition: 'Moderate',
        priorityScore: 52,
        visualVariation: 53,
        date: '17 Sep 2026',
        status: 'Needs Field Verification',
        recentImage: '/heritage/amer-fort/sheesh-mahal/sm-01/historical/2016.jpg',
        currentImage: '/heritage/amer-fort/sheesh-mahal/sm-01/baseline-2026.jpg',
      },
      {
        analysisId: 'DV-ANL-2026-0842',
        elementId: 'SM-02',
        elementName: 'Central Mirror Ceiling',
        elementHindi: 'केंद्रीय शीशा छत',
        monumentName: 'Amer Fort, Jaipur',
        condition: 'Stable',
        priorityScore: 28,
        visualVariation: 15,
        date: '12 Sep 2026',
        status: 'Archived Baseline',
        recentImage: '/heritage/amer-fort/sheesh-mahal/sm-01/archive-reference.jpg',
        currentImage: '/heritage/amer-fort/sheesh-mahal/sm-01/historical/sheesh-mahal-2021.jpg',
      },
      {
        analysisId: 'DV-ANL-2026-0799',
        elementId: 'SM-03',
        elementName: 'Decorative Arch',
        elementHindi: 'सजावटी मेहराब',
        monumentName: 'Amer Fort, Jaipur',
        condition: 'High Priority',
        priorityScore: 78,
        visualVariation: 71,
        date: '04 Sep 2026',
        status: 'Site Inspection Queued',
        recentImage: '/heritage/amer-fort/sheesh-mahal/sm-01/historical/sheesh-mahal-2000.jpg',
        currentImage: '/heritage/amer-fort/sheesh-mahal/sm-01/historical/amer-2018.jpg',
      },
      {
        analysisId: 'DV-ANL-2026-0715',
        elementId: 'SM-04',
        elementName: 'Marble Panel',
        elementHindi: 'संगमरमर पैनल',
        monumentName: 'Amer Fort, Jaipur',
        condition: 'Stable',
        priorityScore: 32,
        visualVariation: 19,
        date: '18 Aug 2026',
        status: 'Verified Stable',
        recentImage: '/heritage/amer-fort/sheesh-mahal/sm-01/timeline-2009.jpg',
        currentImage: '/heritage/amer-fort/sheesh-mahal/sm-01/timeline-2020.jpg',
      },
    ],
  };
}
