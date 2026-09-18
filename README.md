**# DigiVirasat 2.0 (डिजीविरासत २.०)**

**### Digital Heritage Preservation & Cloud Vision Platform**

\> **\*\*"Some stories are written in stone."\*\***  

\> *\*"कुछ कहानियाँ पत्थरों में लिखी होती हैं।"\**  

\>  

\> *\*Explore the story. Document the present. Preserve the future.\**

**---**

**## Executive Summary**

**\*\*DigiVirasat 2.0\*\*** is an enterprise-grade digital heritage preservation platform architected to protect and monitor India's priceless architectural monuments. Built with a synthesis of cinematic cultural design and AWS serverless infrastructure, the platform connects visitor observations with a structured heritage-monitoring workflow.

By turning on-site visitor photography into structured visual observations, DigiVirasat compares a current capture with an element-specific reference image to identify detected visual variation. The system uses these automated differences as monitoring and verification signals rather than as proof of physical deterioration.

**---**

**## Visual Design Language**

Inspired by the classical aesthetics of Indian royal architecture and modern editorial design:

\- **\*\*Palette\*\***: Warm ivory & parchment (\`#FBF8F2\`, \`#F5EFE6\`), sandstone (\`#C89D66\`), muted antique gold (\`#C5A059\`), deep charcoal & umber (\`#16120E\`, \`#1F1813\`), and subtle heritage forest green (\`#2D4B39\`).

\- **\*\*Typography\*\***: Display serif headings (*\*Playfair Display\**, *\*Cormorant Garamond\**), bilingual Devanagari (*\*Noto Serif Devanagari\**, *\*Noto Sans Devanagari\**), and readable modern sans (*\*Inter\**).

\- **\*\*Architectural Accents\*\***: Delicate Rajput arches, jaali latticework vectors, and soft gold border gradients.

**---**

**## Primary Demo Monument & Elements**

**### \*\*Amer Fort (आमेर किला)\*\* — Jaipur, Rajasthan, India**

\- **\*\*Chamber\*\***: Sheesh Mahal (Palace of Mirrors / Jai Mandir)

\- **\*\*Primary Preservation Element\*\***: **\*\*SM-01 East Mirror Wall (पूर्वी शीशा दीवार)\*\***

  - *\*Craftsmanship\**: 18th-century Thikri convex mirror glass mosaics embedded in organic Araish lime plaster.

  - *\*Calibrated Benchmark\**: High-resolution baseline captured in 2016 (\`recent/amer-fort/SM-01-2016.jpg\`).

\- **\*\*Additional Monitored Elements\*\***:

  - \`SM-02\`: Central Mirror Ceiling (केंद्रीय शीशा छत)

  - \`SM-03\`: Decorative Arch (सजावटी मेहराब)

  - \`SM-04\`: Marble Panel (संगमरमर पैनल)

**---**

**## System Architecture

The frontend communicates with a credential-free AWS serverless backend. Visitor images are uploaded directly to a private Amazon S3 bucket using short-lived presigned URLs. The analysis Lambda retrieves the element-specific reference image and current capture, uses Amazon Rekognition to extract visual labels and detected text, calculates visual variation and a monitoring priority score, and then sends the structured evidence to Google Gemini for a concise conservation-monitoring note. Gemini is used to explain and contextualize the structured evidence; it is not used to independently diagnose damage.

```text
[ Visitor / Tourist ]
        │
        ▼
[ React / Vite SPA ]
        │
        ├── 1. POST /uploads/presign ──► [ Amazon API Gateway ]
        │                                      │
        │                                      ▼
        │                                [ Lambda ]
        │                                      │
        │◄──── Short-lived presigned URL ──────┘
        │
        ├── 2. Direct PUT ───────────────► [ Private Amazon S3 ]
        │                                    (heritage-data)
        │
        ├── 3. POST /analyze ────────────► [ Amazon API Gateway ]
        │                                    │
        │                                    ▼
        │                              [ AnalyzeChange Lambda ]
        │                                    │
        │                         ┌──────────┴──────────┐
        │                         ▼                     ▼
        │                [ Amazon Rekognition ]   [ DynamoDB ]
        │                Labels + text           Analysis record
        │                         │
        │                         ▼
        │                Visual comparison
        │                + priority scoring
        │                         │
        │                         ▼
        │                  [ Google Gemini ]
        │                Structured preservation
        │                     insight
        │                         │
        │                         ▼
        │                    [ DynamoDB ]
        │
        │◄──── 4. GET /analysis/{id} ─── [ API Gateway ]
        │
        ▼
[ Analysis Result / Dashboard ]
```

### AI & Analysis Layer

**Amazon Rekognition** provides structured computer-vision evidence from the reference and current photographs, including detected labels and text.

**AWS Lambda** performs the application-side comparison. It calculates the detected visual variation, derives monitoring factors and a priority score, and persists the analysis record.

**Google Gemini (`gemini-3.6-flash`)** converts the structured comparison evidence into a professional conservation-monitoring note. The prompt explicitly requires four sections: **Observation**, **Verification Focus**, **Field Documentation**, and **Conservation Note**. Gemini does not receive the images for this step and is not asked to independently determine whether damage exists.

### AWS Services Utilized

1. **Amazon API Gateway (HTTP API)**: Central entry point routing REST requests to backend Lambdas in `ap-south-1`.
2. **AWS Lambda**: Serverless functions for presigned upload generation, image analysis/orchestration, analysis retrieval, and dashboard aggregation.
3. **Amazon S3 (`digivirasat-heritage-data-2026`)**: Private object storage holding reference images and visitor uploads. Direct client uploads use short-lived presigned URLs.
4. **Amazon Rekognition**: Computer-vision service used to extract visual labels and detected text from the reference and current images.
5. **Amazon DynamoDB**: NoSQL persistence for heritage-element metadata and analysis records, including visual variation, priority score, condition, preservation insight, and recommended action.

### External AI Service

6. **Google Gemini (`gemini-3.6-flash`)**: Generates the human-readable preservation-monitoring note from structured analysis evidence. The Gemini API key is stored only in the backend Lambda environment and is never exposed to the frontend.

## Methodological Integrity & Safety Notice**

\> [!IMPORTANT]

\> **\*\*Standardized Preservation Protocol:\*\*** Detected visual differences do **\*\*not\*\*** by themselves confirm physical deterioration or structural damage. Atmospheric variations, lighting angles, and camera lens distortions can induce optical variance. All DigiVirasat indicators serve as **\*\*prioritization flags\*\*** to guide certified Archaeological Survey personnel for standardized on-site inspection.

**---**

**## Application Routes**

\| Route | Page | Description |

\|---|---|---|

\| \`/\` | **\*\*Home\*\*** | Cinematic Amer Fort hero, bilingual headlines, statistics, feature philosophy, and featured heritage cards. |

\| \`/explore\` | **\*\*Explore Heritage\*\*** | State-level regional filters, real-time search, and cards for Indian monuments. |

\| \`/monument/\:monumentId\` | **\*\*Monument Detail\*\*** | Deep historical chronicles, architectural syncretism, fact cards, and preservation elements. |

\| \`/monument/\:id/element/\:elementId\` | **\*\*Element Detail\*\*** | Editorial dossier on SM-01 East Mirror Wall, Thikri craftsmanship, and interactive timeline. |

\| \`/preserve\` | **\*\*Preservation Workflow\*\*** | 3-step animated workflow: Select Element $\rightarrow$ S3 Presigned Upload $\rightarrow$ 6-Stage Rekognition Analysis. |

\| \`/analysis/\:analysisId\` | **\*\*Analysis Result\*\*** | Condition classification, animated circular priority gauge (0–100), interactive Before/After comparison slider, detected variation tags, and printable preservation certificate. |

\| \`/timeline\` | **\*\*Heritage Timeline\*\*** | 400-year chronological continuum from 1592 citadel founding to 2026 active cloud preservation. |

\| \`/dashboard\` | **\*\*Command Center\*\*** | Conservation control room with aggregate KPIs, health status distribution, and recent analyses table. |

\| \`/about\` | **\*\*About & Architecture\*\*** | Mission statement, conservation philosophy, and visual cloud topology diagram. |

**---**

**## Getting Started**

**### Prerequisites**

\- Node.js (v18 or higher recommended)

\- npm (v9 or higher)

**### Installation**

Clone or navigate to the project directory:

\`\`\`bash

cd digivirasat2.0

npm install

\`\`\`

**### Environment Configuration**

Create a \`.env\` file from \`.env.example\`:

\`\`\`bash

cp .env.example .env

\`\`\`

Configure your AWS API Gateway endpoint URL in \`.env\`:

\`\`\`env

\# Base URL for AWS API Gateway (e.g., https\://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com)

VITE\_API\_BASE\_URL=https\://your-api-id.execute-api.ap-south-1.amazonaws.com

\# AWS Region

VITE\_AWS\_REGION=ap-south-1

\`\`\`

\> **\*\*Security Guarantee:\*\*** Never place AWS access keys, secret keys, or IAM credentials in this repository or \`.env\`. The frontend operates strictly via API Gateway endpoints and presigned S3 URLs.

**### Running in Development Mode**

\`\`\`bash

npm run dev

\`\`\`

Open your browser at \`http\://localhost:5173\`.

**### Building for Production**

\`\`\`bash

npm run build

\`\`\`

The optimized bundle will be generated inside \`dist/\`.

To preview the production build locally:

\`\`\`bash

npm run preview

\`\`\`

**---**

**## 3-Minute Hackathon Demo Script**

1\. **\*\*Home (\`/\`)\*\***:

   - Present the cinematic hero banner with Amer Fort, authentic Hindi typography, and animated statistics and the project's heritage-preservation philosophy.

   - Scroll through "Heritage is not static" philosophy and featured heritage monuments.

2\. **\*\*Explore (\`/explore\`)\*\***:

   - Filter monuments by state (Rajasthan) or search for "Amer".

3\. **\*\*Amer Fort (\`/monument/amer-fort\`)\*\***:

   - Showcase architectural syncretism, historical pull quotes, and open the Preservation Elements tab.

4\. **\*\*SM-01 East Mirror Wall (\`/monument/amer-fort/element/SM-01\`)\*\***:

   - Explore the Thikri glass craftsmanship story, Belgian convex mirror origins, and click **\*\*"Document Current Condition"\*\***.

5\. **\*\*Preservation Workflow (\`/preserve\`)\*\***:

   - Review pre-selected element SM-01.

   - Upload a current photograph through the secure S3 upload workflow.

   - Watch the current photograph upload directly to the private Amazon S3 bucket.

   - Click **\*\*"Analyze Change →"\*\*** to witness the 6-stage sequential Rekognition analysis loader.

6\. **\*\*Preservation Analysis Result (\`/analysis/\:analysisId\`)\*\***:

   - Inspect the dynamic condition, priority score, visual variation percentage, detected feature differences, and preservation-monitoring note.

   - Drag the interactive Before/After comparison slider (reference image vs Current Visitor Capture).

   - Review detected visual variations, safety disclaimer, and click **\*\*"View Preservation Certificate"\*\*** to open the printable record.

7\. **\*\*Conservation Command Center (\`/dashboard\`)\*\***:

   - Open the command center to view live monitoring KPIs, element health breakdown, and recent observation logs linked directly to analysis dossiers.

8\. **\*\*Cloud Architecture (\`/about\`)\*\***:

   - Walk through the serverless architecture showing credential-free frontend access, S3 presigned uploads, Rekognition evidence extraction, Gemini-based narrative generation, and DynamoDB persistence.

**---**

**## Project Structure**

\`\`\`

digivirasat2.0/

├── public/

│   └── heritage/                     # Calibrated historical photography & baselines

│       ├── amer-fort/                # Amer Fort hero & Sheesh Mahal chamber photos

│       │   └── sheesh-mahal/sm-01/   # SM-01 2016 baseline & historical archives

│       ├── ajanta/

│       ├── hampi/

│       └── konark/

├── src/

│   ├── api/                          # Clean API integration layer

│   │   ├── apiClient.js              # Centralized fetch wrapper & timeout management

│   │   ├── uploadApi.js              # S3 presigned URL retrieval & direct PUT upload

│   │   ├── analysisApi.js            # POST /analyze & GET /analysis/{id}

│   │   └── dashboardApi.js           # Extensible conservation dashboard endpoints

│   ├── components/

│   │   ├── about/                    # AwsArchitectureDiagram

│   │   ├── heritage/                 # MonumentCard, ElementCard

│   │   ├── layout/                   # Sticky Navbar, Editorial Footer

│   │   ├── preservation/             # ImageComparison, PriorityScore, AnalysisLoader, DigitalRecordModal

│   │   └── ui/                       # OrnamentDivider, HindiHeading, StatusBadge, MetricCard

│   ├── data/                         # Domain knowledge & historical records

│   │   ├── monuments.js              # Monument catalog & architectural highlights

│   │   ├── elements.js               # SM-01 to SM-04 preservation metadata

│   │   ├── timeline.js               # 400-year chronological milestones

│   │   └── heritageStories.js        # Editorial narratives on Thikri glass mosaic art

│   ├── pages/                        # 9 fully realized application routes

│   │   ├── Home.jsx

│   │   ├── Explore.jsx

│   │   ├── Monument.jsx

│   │   ├── ElementDetail.jsx

│   │   ├── Preserve.jsx

│   │   ├── Analysis.jsx

│   │   ├── Timeline.jsx

│   │   ├── Dashboard.jsx

│   │   └── About.jsx

│   ├── App.jsx                       # Route orchestration & scroll restoration

│   ├── index.css                     # Tailwind CSS v4 design system tokens

│   └── main.jsx

├── .env.example                      # Documented environment template

├── .gitignore                        # Strict secret exclusion

├── package.json

├── README.md

└── vite.config.js                    # Vite configuration with @tailwindcss/vite

\`\`\`

**---**

**## Security & Data Handling

- The frontend contains no AWS access keys or secret credentials.
- Visitor images are uploaded to a private S3 bucket using short-lived presigned URLs.
- The Gemini API key is stored only as the `GEMINI_API_KEY` environment variable in the backend Lambda and must never be committed to GitHub.
- `.env` files and deployment ZIP artifacts should remain excluded through `.gitignore`.
- Automated visual variation is presented as a verification signal, not as a confirmed conservation diagnosis.

---

## License & Heritage Dedication**

Dedicated to the digital preservation of Indian cultural heritage. Built for modern web and cloud architecture hackathons.