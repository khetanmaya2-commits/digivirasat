import {
  RekognitionClient,
  DetectLabelsCommand,
  DetectTextCommand
} from "@aws-sdk/client-rekognition";

import {
  S3Client,
  HeadObjectCommand
} from "@aws-sdk/client-s3";

import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand
} from "@aws-sdk/client-dynamodb";

import { GoogleGenAI } from "@google/genai";


const region = "ap-south-1";

const rekognition = new RekognitionClient({
  region
});

const dynamodb = new DynamoDBClient({
  region
});
const s3 = new S3Client({
  region
});


const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const bucket = "digivirasat-heritage-data-2026";
const analysisTable = "DigiVirasatAnalyses";
const elementsTable = "DigiVirasatHeritageElements";


// Analyze one image
async function analyzeImage(imageKey) {

  const image = {
    S3Object: {
      Bucket: bucket,
      Name: imageKey
    }
  };

  console.log("Checking S3 object:", imageKey);

  await s3.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: imageKey
    })
  );

  console.log("S3 object accessible:", imageKey);

  const labelsResponse = await rekognition.send(
    new DetectLabelsCommand({
      Image: image,
      MaxLabels: 20,
      MinConfidence: 70
    })
  );

  const textResponse = await rekognition.send(
    new DetectTextCommand({
      Image: image
    })
  );

  return {
    imageKey,

    labels: (labelsResponse.Labels || []).map(label => ({
      name: label.Name,
      confidence: Number(
        (label.Confidence || 0).toFixed(2)
      )
    })),

    detectedText:
      (textResponse.TextDetections || [])
        .filter(item => item.Type === "LINE")
        .map(item => ({
          text: item.DetectedText,
          confidence: Number(
            (item.Confidence || 0).toFixed(2)
          )
        }))
  };
}

async function testBedrock() {
  const command = new ConverseCommand({
    modelId: bedrockModelId,

    messages: [
      {
        role: "user",
        content: [
          {
            text:
              "Explain in one short sentence why visual differences " +
              "between two heritage photographs should be verified " +
              "before declaring physical deterioration."
          }
        ]
      }
    ],

    inferenceConfig: {
      maxTokens: 150,
      temperature: 0.2
    }
  });

  const response = await bedrock.send(command);

  return (
    response.output?.message?.content?.[0]?.text ||
    "No Bedrock response generated."
  );
}

// Compare two Rekognition results
function compareImages(recent, current) {

  const recentLabels = new Set(
    recent.labels.map(
      label => label.name.toLowerCase()
    )
  );

  const currentLabels = new Set(
    current.labels.map(
      label => label.name.toLowerCase()
    )
  );

  const newLabels = [...currentLabels]
    .filter(label => !recentLabels.has(label));

  const removedLabels = [...recentLabels]
    .filter(label => !currentLabels.has(label));

  const allFeatures = new Set([
    ...recentLabels,
    ...currentLabels
  ]);

  const changedFeatures =
    newLabels.length + removedLabels.length;

  const totalFeatures = allFeatures.size;

  let visualChangeScore = 0;

  if (totalFeatures > 0) {
    visualChangeScore = Math.round(
      (changedFeatures / totalFeatures) * 100
    );
  }

  return {
    newLabels,
    removedLabels,
    changedFeatures,
    totalFeatures,
    visualChangeScore
  };
}


// Calculate preservation priority
function calculatePriorityScore(
  comparison,
  current
) {

  const visualChange =
    comparison.visualChangeScore;

  const surfaceCondition =
    Math.min(
      Math.round(visualChange * 0.9),
      100
    );

  const structuralConcern =
    Math.min(
      Math.round(visualChange * 0.5),
      100
    );

  const historicalSignificance = 80;

  const visitorExposure =
    current.labels.some(
      label =>
        label.name.toLowerCase() === "person"
    )
      ? 70
      : 40;

  const score =
      visualChange * 0.30 +
      surfaceCondition * 0.25 +
      structuralConcern * 0.20 +
      historicalSignificance * 0.15 +
      visitorExposure * 0.10;

  return Math.round(score);
}


// Convert score into condition
function getCondition(score) {

  if (score <= 30) return "Low";

  if (score <= 60) return "Moderate";

  if (score <= 80) return "High";

  return "Critical";
}


// Generate preservation insight
function generateInsight(condition, comparison) {
  const changed = comparison.changedFeatures || 0;
  const total = comparison.totalFeatures || 0;
  const variation = comparison.visualChangeScore || 0;

  const newLabels = comparison.newLabels || [];
  const removedLabels = comparison.removedLabels || [];

  if (changed === 0) {
    return (
      `The current capture shows no detected feature-level differences ` +
      `from the reference image, with ${variation}% measured visual variation ` +
      `across ${total} detected features. The observed feature set remains ` +
      `consistent with the reference capture. Continue periodic monitoring using ` +
      `standardized photographs for comparable future observations.`
    );
  }

  let insight =
    `The current capture shows ${changed} detected feature-level differences ` +
    `compared with the reference image, representing ${variation}% visual variation ` +
    `across ${total} detected features.`;

  if (newLabels.length > 0) {
    insight +=
      ` Labels present in the current capture but not detected in the reference ` +
      `include ${newLabels.join(", ")}.`;
  }

  if (removedLabels.length > 0) {
    insight +=
      ` Labels detected in the reference but not in the current capture ` +
      `include ${removedLabels.join(", ")}.`;
  }

  insight +=
    ` These differences describe changes in the detected visual feature set ` +
    `and do not by themselves establish physical deterioration. Differences ` +
    `may result from viewpoint, lighting, scene composition, occlusion, or ` +
    `actual physical change. The preservation monitoring status is ${condition}. ` +
    `Standardized photography or on-site inspection should be used to verify ` +
    `any suspected physical change before conservation decisions are made.`;

  return insight;
}


// Recommended preservation action
function generateRecommendation(condition) {

  if (condition === "Low") {

    return (
      "Continue periodic monitoring and capture future " +
      "photographs from a similar viewpoint."
    );
  }

  if (condition === "Moderate") {

    return (
      "Capture a standardized follow-up photograph and " +
      "perform a visual inspection of the heritage element."
    );
  }

  if (condition === "High") {

    return (
      "Prioritize an on-site inspection and document the " +
      "affected area for conservation review."
    );
  }

  return (
    "Prioritize immediate conservation assessment and " +
    "detailed documentation of the heritage element."
  );
}


// Main Lambda function
export const handler = async (event) => {

  const bedrockTest = await testBedrock();

console.log(
  "BEDROCK TEST RESPONSE:",
  bedrockTest
);

  console.log(
    "DigiVirasat analysis event:",
    JSON.stringify(event)
  );
// Parse request body from API Gateway
let requestBody = event;

if (typeof event.body === "string") {
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    console.error("Failed to parse request body:", error);

    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: "Request body must be valid JSON"
      })
    };
  }
} else if (
  event.body &&
  typeof event.body === "object"
) {
  requestBody = event.body;
}

console.log(
  "Parsed request body:",
  JSON.stringify(requestBody)
);

const elementId =
  requestBody.elementId || "SM-01";

const monumentId =
  requestBody.monumentId || "amer-fort";

  const currentImageKey =
  requestBody.currentImageKey;

  let recentImageKey;

  const elementResponse = await dynamodb.send(
    new GetItemCommand({
      TableName: elementsTable,
      Key: {
        elementId: { S: elementId }
      }
    })
  );
  
  if (!elementResponse.Item) {
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: "Heritage element not found",
        elementId
      })
    };
  }
  
  recentImageKey =
    elementResponse.Item.referenceImageKey?.S;
  
  if (!recentImageKey) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: "Reference image is not configured for this heritage element",
        elementId
      })
    };
  }
  
  console.log(
    "Reference image loaded from DynamoDB:",
    recentImageKey
  );

  // 1. Analyze recent/reference image

  console.log(
    "Analyzing recent image:",
    recentImageKey
  );

  const recent =
    await analyzeImage(recentImageKey);


  // 2. Analyze current image

  console.log(
    "Analyzing current image:",
    currentImageKey
  );

  const current =
    await analyzeImage(currentImageKey);


  // 3. Compare observations

  const comparison =
    compareImages(
      recent,
      current
    );


  // 4. Calculate score

  const priorityScore =
    calculatePriorityScore(
      comparison,
      current
    );


  // 5. Determine condition

  const condition =
    getCondition(priorityScore);


  // 6. Generate insight

  const preservationInsight =
    generateInsight(
      condition,
      comparison
    );


  // 7. Generate recommendation

  const recommendedAction =
    generateRecommendation(
      condition
    );


  // 8. Create analysis ID

  const analysisId =
    `ANL-${elementId}-${Date.now()}`;

  const createdAt =
    new Date().toISOString();


  // 9. Save to DynamoDB

  await dynamodb.send(
    new PutItemCommand({

      TableName: analysisTable,

      Item: {

        analysisId: {
          S: analysisId
        },

        elementId: {
          S: elementId
        },

        monumentId: {
          S: monumentId
        },

        historicalImage: {
          S: recentImageKey
        },

        recentImage: {
          S: recentImageKey
        },

        currentImage: {
          S: currentImageKey
        },

        condition: {
          S: condition
        },

        priorityScore: {
          N: String(priorityScore)
        },

        changes: {
          L: [
            ...comparison.newLabels.map(
              label => ({
                S: `New detected feature: ${label}`
              })
            ),

            ...comparison.removedLabels.map(
              label => ({
                S: `Feature not detected in current image: ${label}`
              })
            )
          ]
        },

        preservationInsight: {
          S: preservationInsight
        },

        recommendedAction: {
          S: recommendedAction
        },

        createdAt: {
          S: createdAt
        }

      }

    })
  );


  // 10. Return result

  return {

    statusCode: 200,

    body: JSON.stringify({

      message:
        "DigiVirasat analysis completed successfully",

      analysisId,

      elementId,

      monumentId,

      recentImageKey,

      currentImageKey,

      comparison,

      condition,

      priorityScore,

      preservationInsight,

      recommendedAction,

      createdAt

    })

  };
};