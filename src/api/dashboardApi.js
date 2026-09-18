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
      const response = await apiRequest(
        '/dashboard/analyses',
        { method: 'GET' },
        5000
      );

      if (response && Array.isArray(response.records)) {
        return {
          isLive: response.isLive !== false,
          source:
            response.source ||
            'DigiVirasatAnalyses DynamoDB',
          records: response.records,
        };
      }
    } catch (error) {
      console.error(
        'Failed to load live dashboard analyses:',
        error
      );
    }
  }

  return {
    isLive: false,
    source: 'Conservation Archive & Baseline Observation Log',
    records: [
      // keep your existing static records here
    ],
  };
}