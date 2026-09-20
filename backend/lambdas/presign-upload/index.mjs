import {
  S3Client,
  PutObjectCommand
} from "@aws-sdk/client-s3";

import {
  getSignedUrl
} from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION || "ap-south-1";

const s3 = new S3Client({
  region
});

const bucket =
  "digivirasat-heritage-data-2026";

export const handler = async (event) => {

  console.log(
    "Presign request:",
    JSON.stringify(event)
  );

  let body = {};

  try {
    body =
      typeof event.body === "string"
        ? JSON.parse(event.body)
        : event.body || {};
  } catch (error) {

    return {
      statusCode: 400,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        error: "Invalid JSON body"
      })
    };
  }


  const fileName =
    body.fileName;

  const contentType =
    body.contentType || "image/jpeg";

  const elementId =
    body.elementId || "SM-01";


  if (!fileName) {

    return {
      statusCode: 400,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        error: "fileName is required"
      })
    };
  }


  // Keep uploads inside the uploads folder.
  const safeFileName =
    fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

  const key =
    `uploads/amer-fort/${elementId}/${Date.now()}-${safeFileName}`;


  const command =
    new PutObjectCommand({

      Bucket: bucket,

      Key: key,

      ContentType: contentType

    });


  const uploadUrl =
    await getSignedUrl(
      s3,
      command,
      {
        expiresIn: 300
      }
    );


  return {

    statusCode: 200,

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({

      message:
        "Presigned upload URL generated",

      uploadUrl,

      bucket,

      key,

      expiresIn: 300

    })

  };
};