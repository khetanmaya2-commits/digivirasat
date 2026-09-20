import {
  DynamoDBClient,
  ScanCommand
} from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({
  region: "ap-south-1"
});

const tableName = "DigiVirasatTemporalEvidence";

export const handler = async (event) => {
  try {
    const pathParams = event.pathParameters || {};

const monumentId =
  pathParams.monumentId || "amer-fort";

const evidenceScope =
  decodeURIComponent(
    pathParams.scope || "Sheesh Mahal"
  );

    const result = await dynamodb.send(
      new ScanCommand({
        TableName: tableName
      })
    );

    const evidence = (result.Items || [])
      .map((item) => ({
        evidenceId: item.evidenceId?.S || null,
        monumentId: item.monumentId?.S || null,
        evidenceScope: item.evidenceScope?.S || null,
        evidenceStatus: item.evidenceStatus?.S || null,
        year: item.year?.N
          ? Number(item.year.N)
          : null,
        captureDate: item.captureDate?.S || null,
        title: item.title?.S || null,
        sourceType: item.sourceType?.S || null,
        sourceUrl: item.sourceUrl?.S || null,
        imageUrl: item.imageUrl?.S || null,
        s3Key: item.s3Key?.S || null,
        author: item.author?.S || null,
        license: item.license?.S || null,
        description: item.description?.S || null,
        latitude: item.latitude?.S || null,
        longitude: item.longitude?.S || null,
        evidenceCount: item.evidenceCount?.N
          ? Number(item.evidenceCount.N)
          : null
      }))
      .filter(
        item =>
          item.monumentId?.toLowerCase() ===
            monumentId.toLowerCase() &&
          item.evidenceScope?.toLowerCase() ===
            evidenceScope.toLowerCase()
      )
      .sort((a, b) => (a.year || 0) - (b.year || 0));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: true,
        count: evidence.length,
        evidence
      })
    };

  } catch (error) {
    console.error("Temporal evidence retrieval error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: false,
        message: error.message
      })
    };
  }
};