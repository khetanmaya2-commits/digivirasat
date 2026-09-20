import {
  DynamoDBClient,
  ScanCommand
} from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({
  region: "ap-south-1"
});

const tableName = "DigiVirasatAnalyses";

export const handler = async (event) => {
  try {
    const result = await dynamodb.send(
      new ScanCommand({
        TableName: tableName
      })
    );

    const analyses = (result.Items || [])
      .map((item) => ({
        analysisId: item.analysisId?.S || null,
        analysisType: item.analysisType?.S || null,
        monumentId: item.monumentId?.S || null,
        evidenceScope: item.evidenceScope?.S || null,

        fromYear: item.fromYear?.N
          ? Number(item.fromYear.N)
          : null,

        toYear: item.toYear?.N
          ? Number(item.toYear.N)
          : null,

        fromEvidenceId:
          item.fromEvidenceId?.S || null,

        toEvidenceId:
          item.toEvidenceId?.S || null,

        fromImageKey:
          item.fromImageKey?.S || null,

        toImageKey:
          item.toImageKey?.S || null,

        visualChangeScore:
          item.visualChangeScore?.N
            ? Number(item.visualChangeScore.N)
            : null,

        changedFeatures:
          item.changedFeatures?.N
            ? Number(item.changedFeatures.N)
            : null,

        totalFeatures:
          item.totalFeatures?.N
            ? Number(item.totalFeatures.N)
            : null,

        newLabels:
          item.newLabels?.SS || [],

        removedLabels:
          item.removedLabels?.SS || [],

        spatialChanges:
          item.spatialChanges?.S || "none detected",

        preservationInsight:
          item.preservationInsight?.S || null,

        createdAt:
          item.createdAt?.S || null
      }))
      .filter(
        (item) =>
          item.analysisType ===
          "TEMPORAL_COMPARISON"
      )
      .filter(
        (item) =>
          item.analysisId?.startsWith(
            "TEMP-amer-fort-Sheesh-Mahal-"
          )
      )
      .sort(
        (a, b) =>
          (a.fromYear || 0) -
          (b.fromYear || 0)
      );
    
      const summaryRecords = (result.Items || [])
      .map((item) => ({
        analysisId: item.analysisId?.S || null,
        analysisType: item.analysisType?.S || null,
        monumentId: item.monumentId?.S || null,
        evidenceScope: item.evidenceScope?.S || null,
        fromYear: item.fromYear?.N
          ? Number(item.fromYear.N)
          : null,
        toYear: item.toYear?.N
          ? Number(item.toYear.N)
          : null,
        pairCount: item.pairCount?.N
          ? Number(item.pairCount.N)
          : null,
        overallTemporalSummary:
          item.preservationInsight?.S || null,
        createdAt: item.createdAt?.S || null
      }))
      .filter(
        (item) =>
          item.analysisType === "TEMPORAL_SUMMARY" &&
          item.monumentId === "amer-fort" &&
          item.evidenceScope === "Sheesh Mahal"
      );

      const latestSummary =
  summaryRecords.sort(
    (a, b) =>
      new Date(b.createdAt || 0) -
      new Date(a.createdAt || 0)
  )[0] || null;

    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },

      body: JSON.stringify({
        success: true,
        count: analyses.length,
      
        latestAvailableYear:
          analyses.length
            ? Math.max(
                ...analyses.map(
                  (item) => item.toYear || 0
                )
              )
            : null,
      
        analyses,
      
        overallTemporalSummary:
          latestSummary?.overallTemporalSummary || null,
      
        temporalSummary:
          latestSummary
      })
    };

  } catch (error) {

    console.error(
      "Get temporal analyses error:",
      error
    );

    return {
      statusCode: 500,

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },

      body: JSON.stringify({
        success: false,
        message:
          "Failed to retrieve temporal analyses.",
        error: error.message
      })
    };
  }
};