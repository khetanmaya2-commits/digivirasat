# DigiVirasat 2.0 (डिजीविरासत २.०)

### Digital Heritage Preservation & Remote Visual Monitoring Platform

> **"Some stories are written in stone."**
>
> *"कुछ कहानियाँ पत्थरों में लिखी होती हैं।"*
>
> **Explore the story. Document the present. Preserve the future.**

---

## Executive Summary

**DigiVirasat 2.0** is a digital heritage preservation platform that creates a structured photographic evidence record for India's cultural monuments.

The platform combines a heritage-focused React interface with AWS serverless infrastructure to collect, store, analyze, and organize heritage photographs over time.

DigiVirasat uses computer vision to identify **detected visual-category variation** between available photographic records. These observations are presented to conservation teams as a remote monitoring signal rather than as confirmation of physical damage or deterioration.

The system also maintains chronological evidence from different years, allowing conservation teams to review changes across the available photographic record and identify areas where more comparable evidence may be required.

---

## Project Vision

DigiVirasat connects:

- Heritage photography
- Historical evidence
- Cloud storage
- Computer vision
- Temporal comparison
- Conservation-team review

into a single digital workflow.

The goal is to transform scattered heritage photographs into a **structured, continuously growing photographic evidence record**.

---

## Visual Design Language

The interface is inspired by Indian royal architecture and modern editorial design.

- **Palette:** Warm ivory, parchment, sandstone, antique gold, charcoal, umber, and heritage green.
- **Typography:** Serif display typography combined with modern sans-serif text and Devanagari typography.
- **Architectural Accents:** Rajput-inspired arches, jaali patterns, subtle borders, and heritage-inspired visual details.
- **Experience:** Cinematic imagery, editorial layouts, smooth animations, and bilingual cultural storytelling.

---

## Primary Demo Monument

### Amer Fort (आमेर किला)

**Location:** Jaipur, Rajasthan, India

### Primary Heritage Focus

**Sheesh Mahal (शीश महल)**  
Palace of Mirrors / Jai Mandir

### Primary Element

**SM-01 — Sheesh Mahal**

The project uses Sheesh Mahal as the primary demonstration element for photographic evidence and temporal visual monitoring.

Additional heritage elements represented in the application include:

- `SM-02` — Ganesh Pol
- `SM-03` — Decorative Arch
- `SM-04` — Marble Panel

---

# System Architecture

```text
                    DigiVirasat React Frontend
                              |
                              v
                       Amazon API Gateway
                              |
                 +------------+------------+
                 |                         |
                 v                         v
        Presign Upload Lambda       Analysis Lambda
                 |                         |
                 v              +----------+----------+
          Private Amazon S3      |          |         |
                                 v          v         v
                           Rekognition   Gemini   DynamoDB
                                 |
                                 v
                         Visual Comparison
                                 |
                                 v
                    Conservation Dashboard


```

### Temporal Evidence Flow

```text

Historical Photographs
        |
        v
Temporal Evidence Metadata
        |
        v
Private S3 Storage
        |
        v
Amazon Rekognition
        |
        v
Consecutive Comparisons
        |
        v
Detected Visual Variation
        |
        v
Gemini Overall Summary
        |
        v
Conservation Dashboard

```

## AWS Services

1. **Amazon S3**: Private storage for heritage photographs and temporal evidence.

2. **AWS Lambda**: Serverless backend processing for uploads, analysis, and temporal comparisons.

3. **Amazon API Gateway**: HTTP API layer connecting the React frontend with Lambda.

4. **Amazon DynamoDB**: Stores heritage, evidence, and analysis data.

5. **Amazon Rekognition**: Detects visual categories and text in heritage photographs.

6. **Amazon Cognito**: Provides authentication for the conservation-team dashboard.

7. **AWS IAM**: Controls permissions between AWS services.

8. **Gemini API**: Generates structured conservation-monitoring summaries.


## Temporal Evidence

DigiVirasat maintains a chronological photographic record of Sheesh Mahal using available heritage photographs.

The current evidence sequence is:

- **2010 → 2015**
- **2015 → 2019**
- **2019 → 2021**
- **2021 → 2026**

Amazon Rekognition analyzes consecutive records and identifies differences in detected visual categories.

The results are stored in DynamoDB and presented through the conservation dashboard.

> The photographs may represent different viewpoints or portions of the monument, so visual variation scores are treated as evidence signals rather than direct measurements of physical change.

## Remote Monitoring Approach

DigiVirasat enables conservation teams to review heritage evidence remotely through a continuously growing photographic record.

```text
Photographic Evidence
        ↓
Cloud Storage
        ↓
Visual Analysis
        ↓
Temporal Comparison
        ↓
Detected Variation
        ↓
Verification Focus
        ↓
Conservation Review

Visitors, volunteers, researchers, or authorized observers can contribute photographs through the platform.

The system identifies visual variation and highlights areas that may require additional comparable evidence.

AI supports the observation process, while conservation decisions remain with human experts.

```

### Methodological Integrity

```md
## Methodological Integrity

DigiVirasat does not treat detected visual differences as confirmed damage, deterioration, or structural change.

Visual differences can result from:

- Different viewpoints
- Camera angles
- Lighting conditions
- Image quality
- Framing
- Different portions of the monument

Therefore, the system uses the terms **"detected visual variation"** and **"verification focus"** rather than claiming confirmed physical deterioration.

Comparable photographic evidence and expert review are required before drawing conservation conclusions.


## Application Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | DigiVirasat landing page and project overview | Public |
| `/explore` | Explore heritage monuments and preservation elements | Public |
| `/preserve` | Submit a heritage observation or photograph | Public |
| `/dashboard/login` | Conservation-team authentication | Conservation Team |
| `/dashboard` | Review evidence, temporal comparisons, and analysis results | Authenticated |


### Getting Started

## Prerequisites

- Node.js 18+
- npm
- AWS account with the required services configured
- Gemini API key for conservation-monitoring summaries

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd digivirasat
```

## Install dependencies

```bash
npm install
```

## Environment Variables

Create a .env file in the project root:

```bash
VITE_API_BASE_URL=<your-api-gateway-url>

```
Do not commit .env files or API keys to GitHub.


## Run Locally

Start the development server:

```bash
npm run dev
```
The application will be available at:

```bash
http://localhost:5173

```
## Production Build

Create a production build:

```bash
npm run build
```
Preview the production build locally:

```bash
npm run preview
```

### AWS Configuration

The backend uses AWS services in the ap-south-1 region.

The required backend components include:

- Amazon S3
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Amazon Rekognition
- Amazon Cognito
- AWS IAM

### Project Structure

```text

digivirasat2.0/
│
├── public/
│   └── heritage/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── aws/
│   ├── architecture/
│   │   └── README.md
│   ├── dynamodb/
│   │   └── README.md
│   ├── iam/
│   │   └── README.md
│   ├── rekognition/
│   │   └── README.md
│   └── s3/
│       └── README.md
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── vite.config.js

```
### Security

DigiVirasat follows a serverless security model designed to protect heritage evidence and backend resources.

- **Private Amazon S3 bucket** with Block Public Access enabled.
- **SSE-S3 encryption** for stored heritage images.
- **IAM execution roles** for controlled Lambda access to AWS services.
- **Amazon Cognito authentication** for the conservation-team dashboard.
- **API Gateway JWT authorization** for protected dashboard endpoints.
- **Presigned S3 URLs** for secure browser-to-S3 image uploads.
- **No AWS credentials** are exposed in the React frontend.
- API keys and environment variables are kept outside the source repository.

Sensitive credentials such as AWS keys and Gemini API keys must never be committed to GitHub.

### Future Scope

DigiVirasat can be extended into a larger digital heritage monitoring platform.

- Expand coverage to additional monuments and heritage sites.
- Integrate more historical image sources and structured metadata.
- Add standardized photographic capture workflows for more comparable observations.
- Support additional computer-vision techniques for richer visual comparison.
- Build long-term temporal evidence records for individual heritage elements.
- Introduce expert annotation and verification workflows.
- Add multilingual conservation reports and heritage narratives.
- Improve automated evidence matching across viewpoints and image conditions.
- Develop a larger conservation dashboard for multiple monuments.
- Explore integration with heritage organizations and archival repositories.

The long-term goal is to build a continuously growing digital evidence layer that supports heritage documentation and remote monitoring.


## License & Heritage Dedication

This project was created as part of the **Bharat Build Tours 2026** hackathon.

DigiVirasat is an educational prototype focused on digital heritage documentation and remote visual monitoring.

The project is dedicated to preserving India's cultural heritage through technology, accessible documentation, and responsible use of digital evidence.

### Heritage Data Attribution

Historical and reference photographs used in the project are sourced from publicly available heritage repositories and retain their respective authorship and licensing information.

Image attribution and license information are stored as part of the temporal evidence metadata where available.

### Project License

A software license has not yet been added to this repository.

Until a license is added, the source code should not be assumed to be freely reusable, modified, or redistributed.

> Built with technology for heritage, history, and the generations that come next.