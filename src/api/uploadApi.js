/**
 * DigiVirasat 2.0 - S3 Presigned Upload API
 * Obtains presigned S3 URLs from API Gateway and uploads image binaries directly to S3.
 */

import { apiRequest } from './apiClient';

/**
 * Request a presigned S3 upload URL for an architectural element image
 * @param {Object} params
 * @param {string} params.fileName - e.g. "amer-fort-sm01.jpg"
 * @param {string} params.contentType - e.g. "image/jpeg"
 * @param {string} params.elementId - e.g. "SM-01"
 * @returns {Promise<{ uploadUrl: string, bucket: string, key: string, expiresIn: number }>}
 */
export async function getPresignedUploadUrl({ fileName, contentType, elementId = 'SM-01' }) {
  return apiRequest('/uploads/presign', {
    method: 'POST',
    body: JSON.stringify({
      fileName,
      contentType: contentType || 'image/jpeg',
      elementId,
    }),
  });
}

/**
 * Upload binary image file directly to Amazon S3 via presigned PUT URL
 * @param {string} uploadUrl - Presigned S3 URL
 * @param {File|Blob} file - The image file to upload
 * @param {Function} [onProgress] - Optional progress callback receiving percentage (0-100)
 * @returns {Promise<boolean>}
 */
export function uploadToS3(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!uploadUrl) {
      return reject(new Error('S3 upload URL was not provided.'));
    }

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    
    // Set appropriate content type matching the presigned signature
    xhr.setRequestHeader('Content-Type', file.type || 'image/jpeg');

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      // S3 returns 200 OK or 204 No Content for successful PUT
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve(true);
      } else {
        reject(
          new Error(
            `Failed to upload image directly to Amazon S3 (HTTP ${xhr.status}): ${xhr.statusText || 'Upload rejected'}`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred while transferring image to Amazon S3 bucket.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('S3 upload timed out. Please check your connection and retry.'));
    };

    xhr.send(file);
  });
}
