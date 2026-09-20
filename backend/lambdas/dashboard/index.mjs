import {
  DynamoDBClient,
  ScanCommand
} from "@aws-sdk/client-dynamodb";

const region = process.env.AWS_REGION || "ap-south-1";

const dynamodb = new DynamoDBClient({
  region
});

const analysisTable = "DigiVirasatAnalyses";

function getString(item, key) {
  return item?.[key]?.S || "";
}

function getNumber(item, key) {
  return item?.[key]?.N
    ? Number(item[key].N)
    : 0;
}

function getCondition(item) {
  return item?.condition?.S || "";
}
function buildAnalysisRecord(item) {
  const preservationInsight =
    getString(item, "preservationInsight");

  // Extract visual variation percentage from Gemini insight
  const variationMatch =
  preservationInsight.match(
    /(\d+)%\s*(?:visual variation|variation)/i
  ) ||
  preservationInsight.match(
    /(?:visual variation|variation of)\s*(?:is|of)?\s*(\d+)%/i
  );
  const visualVariation = variationMatch
    ? Number(variationMatch[1])
    : 0;
  
    const recentImageKey =
    getString(item, "recentImage") ||
    getString(item, "historicalImage");
  
  const referenceYearMatch =
    recentImageKey.match(/(19|20)\d{2}/);
  
  const referenceYear =
    referenceYearMatch
      ? referenceYearMatch[0]
      : "Reference";

  return {
    analysisId: getString(item, "analysisId"),

    analysisType: getString(item, "analysisType"),

    elementId: getString(item, "elementId"),

    monumentId: getString(item, "monumentId"),

    condition: getCondition(item),

    priorityScore: getNumber(
      item,
      "priorityScore"
    ),

    visualVariation,

    date: getString(
      item,
      "createdAt"
    ),

    status: getString(
      item,
      "recommendedAction"
    ),

    preservationInsight,

    currentImageKey:
      getString(item, "currentImage") ||
      getString(item, "currentImageKey"),

    recentImageKey:
    recentImageKey,
    referenceYear,

    changes: item.changes?.L
      ? item.changes.L
          .map(change => change.S)
          .filter(Boolean)
      : []
  };
}

async function getAllAnalyses() {
  let items = [];
  let ExclusiveStartKey;

  do {
    const response = await dynamodb.send(
      new ScanCommand({
        TableName: analysisTable,
        ExclusiveStartKey
      })
    );

    items = items.concat(response.Items || []);
    ExclusiveStartKey = response.LastEvaluatedKey;

  } while (ExclusiveStartKey);

  return items;
}

function calculateSummary(records) {
  // Keep only the latest analysis for each unique heritage element.
  const latestByElement = new Map();

  records.forEach(record => {
    if (!record.elementId) return;

    const existing = latestByElement.get(record.elementId);

    if (
      !existing ||
      new Date(record.date) > new Date(existing.date)
    ) {
      latestByElement.set(record.elementId, record);
    }
  });

  const latestRecords = Array.from(
    latestByElement.values()
  );
  
  // Health breakdown is based on all analysis records
  const totalElements = latestRecords.length;
  const totalHealthRecords = records.length;
  
  let stable = 0;
  let moderate = 0;
  let highPriority = 0;
  
  records.forEach(record => {
    const condition =
      record.condition?.trim().toLowerCase();
  
    if (
      condition === "stable" ||
      condition === "low"
    ) {
      stable++;
    } else if (
      condition === "moderate"
    ) {
      moderate++;
    } else if (
      condition === "high" ||
      condition === "high priority" ||
      condition === "critical"
    ) {
      highPriority++;
    }
  });

 

  

  const priorityScores = latestRecords
    .map(record => record.priorityScore)
    .filter(score => Number.isFinite(score));

  const avgPriorityScore =
    priorityScores.length > 0
      ? Math.round(
          priorityScores.reduce(
            (sum, score) => sum + score,
            0
          ) / priorityScores.length
        )
      : 0;

  return {
    isLive: true,
    source: "DigiVirasatAnalyses DynamoDB",

    // Unique heritage elements, not analysis count
    totalElements,

    // Total historical analysis records
    totalAnalyses: records.length,

    // Unique elements whose latest status is high/critical
    activeAlerts: highPriority,

    monitoredSites: new Set(
      latestRecords
      .map(record => record.monumentId)
      .filter(Boolean)
    ).size,

    healthDistribution: {
      stable,
      moderate,
      highPriority,
      totalHealthRecords
    },

    avgPriorityScore
  };
}

export const handler = async (event) => {
  console.log(
    "Dashboard event:",
    JSON.stringify(event)
  );

  try {
    const records = await getAllAnalyses();

    const analyses = records
      .map(buildAnalysisRecord)
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );

    const route =
      event?.rawPath ||
      event?.requestContext?.http?.path ||
      event?.path ||
      "";

    console.log("Dashboard route:", route);

    if (route.includes("/dashboard/summary")) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        body: JSON.stringify(
          calculateSummary(analyses)
        )
      };
    }

    if (route.includes("/dashboard/analyses")) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        body: JSON.stringify({
          isLive: true,
          source: "DigiVirasatAnalyses DynamoDB",
          records: analyses
        })
      };
    }

    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message:
          "Unsupported dashboard route",
        receivedRoute: route
      })
    };

  } catch (error) {
    console.error(
      "Dashboard Lambda error:",
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
          "Failed to load dashboard data",
        error: error.message
      })
    };
  }
};