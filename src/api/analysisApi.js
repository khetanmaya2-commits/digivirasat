/**
 * DigiVirasat 2.0 - Visual Analysis API
 * Triggers Amazon Rekognition-powered difference analysis and retrieves persistent analysis records.
 */

import { apiRequest } from './apiClient';

/**
 * Trigger AWS preservation analysis comparing recent baseline and current photograph
 * @param {Object} params
 * @param {string} params.elementId - e.g. "SM-01"
 * @param {string} params.monumentId - e.g. "amer-fort"
 * @param {string} params.recentImageKey - e.g. "recent/amer-fort/SM-01-2016.jpg"
 * @param {string} params.currentImageKey - Actual uploaded S3 key
 * @returns {Promise<Object>} Analysis trigger response with analysisId
 */
export async function analyzeChange({
  elementId = 'SM-01',
  monumentId = 'amer-fort',
  recentImageKey = 'recent/amer-fort/SM-01-2016.jpg',
  currentImageKey,
}) {
  if (!currentImageKey) {
    throw new Error('Current image S3 key is required to initiate visual analysis.');
  }

  return apiRequest(
    '/analyze',
    {
      method: 'POST',
      body: JSON.stringify({
        elementId,
        monumentId,
        recentImageKey,
        currentImageKey,
      }),
    },
    35000 // Allow up to 35 seconds for Rekognition & DynamoDB pipeline
  );
}

/**
 * Retrieve a stored preservation analysis record by ID from DynamoDB via API Gateway
 * @param {string} analysisId - Unique UUID of the analysis record
 * @returns {Promise<Object>} Detailed analysis record
 */
export async function getAnalysis(analysisId) {
  if (!analysisId) {
    throw new Error('Analysis ID is required to fetch preservation record.');
  }

  const rawData = await apiRequest(`/analysis/${encodeURIComponent(analysisId)}`, {
    method: 'GET',
  });

  return normalizeAnalysisData(rawData);
}

/**
 * Normalizes API response to ensure components never crash due to missing optional fields.
 * Gracefully handles varied DynamoDB attribute formats and schema evolutions.
 */
export function normalizeAnalysisData(data) {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const comparison = data.comparison || {};

  // Normalize detected feature labels
  const newLabels = Array.isArray(comparison.newLabels)
    ? comparison.newLabels.map((label) =>
        typeof label === 'string'
          ? label
              .replace(/^New detected feature:\s*/i, '')
              .trim()
          : label
      )
    : [];

  const removedLabels = Array.isArray(comparison.removedLabels)
    ? comparison.removedLabels.map((label) =>
        typeof label === 'string'
          ? label
              .replace(/^Feature not detected in current image:\s*/i, '')
              .replace(/^Not detected in current image:\s*/i, '')
              .trim()
          : label
      )
    : [];

  // Compute visual variation percentage
  let visualVariation = 50;

  if (typeof comparison.visualChangeScore === 'number') {
    visualVariation = Math.round(comparison.visualChangeScore);
  } else if (typeof data.visualVariation === 'number') {
    visualVariation = Math.round(data.visualVariation);
  } else if (
    typeof comparison.totalFeatures === 'number' &&
    comparison.totalFeatures > 0 &&
    typeof comparison.changedFeatures === 'number'
  ) {
    visualVariation = Math.round(
      (comparison.changedFeatures / comparison.totalFeatures) * 100
    );
  }

  // Priority score normalized between 0-100
  let priorityScore = 50;

  if (typeof data.priorityScore === 'number') {
    priorityScore = Math.max(
      0,
      Math.min(100, Math.round(data.priorityScore))
    );
  } else if (typeof data.priority === 'number') {
    priorityScore = Math.max(
      0,
      Math.min(100, Math.round(data.priority))
    );
  }

  // Condition classification
  let condition = data.condition || 'Moderate';

  if (!['Stable', 'Moderate', 'High Priority', 'Critical'].includes(condition)) {
    if (priorityScore < 35) {
      condition = 'Stable';
    } else if (priorityScore <= 65) {
      condition = 'Moderate';
    } else {
      condition = 'High Priority';
    }
  }

  // Preserve the actual S3 keys returned by AWS
  const recentImageKey =
    data.recentImageKey ||
    'recent/amer-fort/SM-01-2016.jpg';

  const currentImageKey =
    data.currentImageKey ||
    '';

  // Reference image
  const referenceImageUrl =
    data.referenceImageUrl ||
    data.historicalImage ||
    data.recentImage ||
    '/heritage/amer-fort/sheesh-mahal/sm-01/historical/2016.jpg';

  // Current uploaded image
  //
  // IMPORTANT:
  // This is the public S3 URL format. If the bucket is private,
  // this URL will not display until the backend provides a presigned GET URL.
  const currentImageUrl =
    data.currentImageUrl ||
    data.currentImage ||
    (
      currentImageKey
        ? `https://digivirasat-heritage-data-2026.s3.ap-south-1.amazonaws.com/${currentImageKey}`
        : null
    );

  return {
    analysisId: data.analysisId || 'DV-ANL-UNKNOWN',

    elementId: data.elementId || 'SM-01',

    monumentId: data.monumentId || 'amer-fort',

    monumentName: data.monumentName || 'Amer Fort',

    elementName: data.elementName || 'East Mirror Wall',

    condition,

    priorityScore,

    visualVariation,

    comparison: {
      newLabels,

      removedLabels,

      changedFeatures:
        typeof comparison.changedFeatures === 'number'
          ? comparison.changedFeatures
          : newLabels.length + removedLabels.length,

      totalFeatures:
        typeof comparison.totalFeatures === 'number'
          ? comparison.totalFeatures
          : newLabels.length + removedLabels.length + 10,

      visualChangeScore: visualVariation,
    },

    changes: [
      ...newLabels.map((label) => ({
        label,
        type: 'new',
      })),

      ...removedLabels.map((label) => ({
        label,
        type: 'removed',
      })),
    ],

    preservationInsight:
      data.preservationInsight ||
      'Comparative visual feature analysis completed across historical baseline and current observation.',

    recommendedAction:
      data.recommendedAction ||
      'Capture a standardized follow-up photograph and perform a visual inspection of the heritage element.',

    createdAt:
      data.createdAt ||
      new Date().toISOString(),

    recentImageKey,

    currentImageKey,

    referenceImageUrl,

    currentImageUrl,
  };
}