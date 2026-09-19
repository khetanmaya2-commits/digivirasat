# DigiVirasat AWS Architecture

DigiVirasat uses AWS serverless services to support secure heritage image storage, visual analysis, temporal evidence comparison, and conservation-team monitoring.

## Architecture Flow

```text
React Frontend
      |
      v
API Gateway
      |
      v
AWS Lambda
      |
  +---+---+
  |       |
  v       v
 S3   DynamoDB
  |
  v
Rekognition
  |
  v
Visual Comparison
  |
  v
Gemini
  |
  v
Conservation Dashboard


```
## Architecture Flow
```
- Amazon S3 — Heritage image and evidence storage
- AWS Lambda — Serverless backend processing
- Amazon API Gateway — Frontend-to-backend API communication
- Amazon DynamoDB — Heritage, evidence, and analysis data
- Amazon Rekognition — Visual and text detection
- Amazon Cognito — Conservation-team authentication
- Gemini API — Structured conservation-monitoring summaries
- AWS IAM — Access control and permissions

```

### Remote Monitoring
```

DigiVirasat builds a chronological photographic evidence record and identifies detected visual variation across available records.

The system does not treat visual variation as confirmed damage or deterioration. Conservation conclusions require comparable evidence and human expert review.

```

### AWS Region

```text
ap-south-1