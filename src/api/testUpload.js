import { getPresignedUploadUrl } from './uploadApi';

export async function testPresign() {
  try {
    const result = await getPresignedUploadUrl({
      fileName: 'digivirasat-test.jpg',
      contentType: 'image/jpeg',
      elementId: 'SM-01',
    });

    console.log('PRESIGN SUCCESS:', result);

    return result;
  } catch (error) {
    console.error('PRESIGN FAILED:', error);
    throw error;
  }
}