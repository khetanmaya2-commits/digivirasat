import {
  S3Client,
  PutObjectCommand
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ap-south-1"
});

const bucket = "digivirasat-heritage-data-2026";

export const handler = async (event) => {
  try {
    const imageUrl = event.imageUrl;
    const evidenceId = event.evidenceId;
    const year = event.year;

    if (!imageUrl || !evidenceId || !year) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "imageUrl, evidenceId and year are required"
        })
      };
    }

    console.log("Downloading:", imageUrl);

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to download image: ${response.status} ${response.statusText}`
      );
    }

    const imageBuffer = Buffer.from(
      await response.arrayBuffer()
    );

    const s3Key =
      `historical/temporal-evidence/sheesh-mahal/${year}/${evidenceId}.jpg`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key,
        Body: imageBuffer,
        ContentType: "image/jpeg"
      })
    );

    console.log("Stored in S3:", s3Key);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        evidenceId,
        year,
        s3Key,
        message: "Temporal evidence image stored successfully"
      })
    };

  } catch (error) {
    console.error("Ingestion error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message
      })
    };
  }
};