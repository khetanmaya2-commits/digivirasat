import {
  DynamoDBClient,
  GetItemCommand
} from "@aws-sdk/client-dynamodb";

import {
  S3Client,
  GetObjectCommand
} from "@aws-sdk/client-s3";

import {
  getSignedUrl
} from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION || "ap-south-1";

const dynamodb = new DynamoDBClient({
  region
});

const s3 = new S3Client({
  region
});

const analysisTable = "DigiVirasatAnalyses";
const bucketName = "digivirasat-heritage-data-2026";

export const handler = async (event) => {
  console.log(
    "Get analysis event:",
    JSON.stringify(event)
  );

  const analysisId =
    event.pathParameters?.analysisId;

  if (!analysisId) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: "analysisId is required"
      })
    };
  }

  try {
    const response = await dynamodb.send(
      new GetItemCommand({
        TableName: analysisTable,
        Key: {
          analysisId: {
            S: analysisId
          }
        }
      })
    );

    if (!response.Item) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          message: "Analysis not found",
          analysisId
        })
      };
    }

    const item = response.Item;

    /*
     * ----------------------------------------------------
     * IMAGE KEYS
     * ----------------------------------------------------
     */

    const currentImageKey =
      item.currentImageKey?.S ||
      item.currentImage?.S ||
      "";

    const referenceImageKey =
      item.referenceImageKey?.S ||
      item.recentImage?.S ||
      item.historicalImage?.S ||
      "";

    /*
     * ----------------------------------------------------
     * SIGNED IMAGE URLS
     * ----------------------------------------------------
     */

    let currentImageUrl = null;
    let referenceImageUrl = null;

    if (currentImageKey) {
      const currentCommand =
        new GetObjectCommand({
          Bucket: bucketName,
          Key: currentImageKey
        });

      currentImageUrl =
        await getSignedUrl(
          s3,
          currentCommand,
          {
            expiresIn: 3600
          }
        );
    }

    if (referenceImageKey) {
      const referenceCommand =
        new GetObjectCommand({
          Bucket: bucketName,
          Key: referenceImageKey
        });

      referenceImageUrl =
        await getSignedUrl(
          s3,
          referenceCommand,
          {
            expiresIn: 3600
          }
        );
    }

    /*
     * ----------------------------------------------------
     * COMPARISON DATA
     * ----------------------------------------------------
     *
     * AnalyzeChange stores the comparison object.
     * Return it directly instead of making the frontend
     * reconstruct fallback values.
     */

    const comparisonItem =
      item.comparison?.M || {};

    const newLabels =
      comparisonItem.newLabels?.L
        ? comparisonItem.newLabels.L
            .map(label => label.S)
            .filter(Boolean)
        : [];

    const removedLabels =
      comparisonItem.removedLabels?.L
        ? comparisonItem.removedLabels.L
            .map(label => label.S)
            .filter(Boolean)
        : [];

    const changedFeatures =
      comparisonItem.changedFeatures?.N
        ? Number(
            comparisonItem.changedFeatures.N
          )
        : 0;

    const totalFeatures =
      comparisonItem.totalFeatures?.N
        ? Number(
            comparisonItem.totalFeatures.N
          )
        : 0;

    const visualChangeScore =
      comparisonItem.visualChangeScore?.N
        ? Number(
            comparisonItem.visualChangeScore.N
          )
        : 0;

    /*
     * ----------------------------------------------------
     * CHANGES
     * ----------------------------------------------------
     */

    const changes =
      item.changes?.L
        ? item.changes.L
            .map(change => change.S)
            .filter(Boolean)
        : [];

    /*
     * ----------------------------------------------------
     * RESULT
     * ----------------------------------------------------
     */

    const result = {
      analysisId:
        item.analysisId?.S,

      elementId:
        item.elementId?.S,

      monumentId:
        item.monumentId?.S,

      historicalImage:
        item.historicalImage?.S || "",

      recentImage:
        referenceImageKey,

      referenceImageKey:
        referenceImageKey,

      referenceImageUrl:
        referenceImageUrl,

      currentImage:
        currentImageKey,

      currentImageKey:
        currentImageKey,

      currentImageUrl:
        currentImageUrl,

      /*
       * Actual Rekognition comparison
       */

      comparison: {
        newLabels,
        removedLabels,
        changedFeatures,
        totalFeatures,
        visualChangeScore
      },

      condition:
        item.condition?.S || "",

      priorityScore:
        item.priorityScore
          ? Number(item.priorityScore.N)
          : 0,

      changes,

      preservationInsight:
        item.preservationInsight?.S || "",

      recommendedAction:
        item.recommendedAction?.S || "",

      createdAt:
        item.createdAt?.S || ""
    };

    console.log(
      "Returning analysis:",
      JSON.stringify({
        analysisId:
          result.analysisId,

        referenceImageKey:
          result.referenceImageKey,

        referenceImageUrl:
          result.referenceImageUrl
            ? "SIGNED_URL_GENERATED"
            : null,

        currentImageKey:
          result.currentImageKey,

        currentImageUrl:
          result.currentImageUrl
            ? "SIGNED_URL_GENERATED"
            : null,

        comparison:
          result.comparison,

        preservationInsight:
          result.preservationInsight
      })
    );

    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods":
          "GET,OPTIONS"
      },

      body: JSON.stringify(result)
    };

  } catch (error) {

    console.error(
      "Get analysis error:",
      error
    );

    return {
      statusCode: 500,

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },

      body: JSON.stringify({
        message:
          "Failed to retrieve preservation analysis",

        error:
          error.message
      })
    };
  }
};