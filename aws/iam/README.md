# AWS IAM

DigiVirasat uses AWS IAM to control access between Lambda functions and AWS services.

## Purpose

IAM permissions allow backend services to securely access only the resources required by the application.

## Main Permissions

Lambda functions use permissions for:

- Amazon S3
  - `s3:GetObject`
  - `s3:PutObject`

- Amazon DynamoDB
  - `dynamodb:GetItem`
  - `dynamodb:PutItem`
  - `dynamodb:Scan`

- Amazon Rekognition
  - Image analysis operations

## Security

- No AWS access keys are stored in the frontend.
- Lambda uses IAM execution roles.
- S3 remains private.
- API authentication is handled separately through Amazon Cognito.

IAM provides the permission and security layer for the DigiVirasat backend.