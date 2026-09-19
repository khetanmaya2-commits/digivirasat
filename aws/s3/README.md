# Amazon S3

DigiVirasat uses Amazon S3 for secure storage of heritage photographs and project assets.

## Bucket

`digivirasat-heritage-data-2026`

## Main Folders

- `historical/` — historical heritage images
- `recent/` — recent/reference images
- `uploads/` — user observation uploads
- `analysis/` — analysis-related objects
- `audio/` — audio assets
- `historical/temporal-evidence/` — chronological evidence images

## Security

- Private bucket
- Block Public Access enabled
- SSE-S3 encryption
- No AWS credentials exposed to the frontend

## Upload Flow

```text
React → API Gateway → Lambda → Presigned URL → S3