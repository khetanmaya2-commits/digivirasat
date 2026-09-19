
# Amazon DynamoDB

DigiVirasat uses Amazon DynamoDB to store structured heritage, evidence, and analysis data.

## Tables

### DigiVirasatHeritageElements

Stores information about heritage elements.

Primary Key:

`elementId`

Example:

`SM-01`

### DigiVirasatAnalyses

Stores visual and temporal analysis results.

Primary Key:

`analysisId`

Stores information such as:

- Comparison years
- Image references
- Visual variation score
- Changed features
- New/removed detected categories
- Preservation insights

### DigiVirasatTemporalEvidence

Stores metadata for historical photographic evidence.

Primary Key:

`evidenceId`

Stores:

- Year
- Capture date
- Source
- Author
- License
- Image URL
- S3 key
- Evidence scope

DynamoDB acts as the structured data layer for DigiVirasat.