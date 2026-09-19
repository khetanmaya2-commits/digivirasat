# Amazon Rekognition

DigiVirasat uses Amazon Rekognition for visual analysis of heritage photographs.

## Functions Used

### DetectLabels

Detects visual categories present in an image.

DigiVirasat filters the results toward architectural and heritage-related categories such as:

- Wall
- Architecture
- Monument
- Stone
- Mirror
- Ornamentation
- Structure
- Door
- Window

### DetectText

Detects visible text within heritage photographs.

## Temporal Comparison

For temporal evidence, Rekognition analyzes consecutive photographs.

```text
2010 → 2015
2015 → 2019
2019 → 2021
2021 → 2026