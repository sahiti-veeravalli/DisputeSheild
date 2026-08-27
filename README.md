# DisputeShield AI 🛡️

**From dispute alert to evidence-ready defense — in seconds.**

DisputeShield AI is an intelligent dispute defense automation system. It automatically investigates incoming payment chargebacks, extracts and ranks evidence from merchant records (transactions, orders, logistics scans, customer support threads, and fraud signals), assesses case readiness, and compiles structured, human-reviewable response packets with an immutable audit trail.

---

## Key Features

- **Automated Evidence Investigation**: Deterministic rule-based engine mapping dispute reasons (*Product Not Received*, *Fraudulent Transaction*, *Duplicate Charge*, *Product Not as Described*) to required merchant evidence items.
- **Explainable Defense Assessment**: Real-time completeness score, missing critical evidence detection, and HIGH/MEDIUM/LOW defense readiness ratings.
- **Evidence Packet Compilation & Review**: Human-in-the-loop merchant approval workflow — nothing is submitted to payment networks without explicit merchant review.
- **Immutable Audit Trail**: Chronological event tracking from dispute receipt to analysis, packet generation, merchant approval, and submission.
- **Honest Held-Out Evaluation (Track 02 Benchmark)**: Built-in synthetic dataset generator and logistic regression model evaluated **exclusively** on held-out test disputes.
  - **Seed**: `42` (reproducible Mulberry32 PRNG)
  - **Dataset Size**: 200 disputes (160 train / 40 held-out test)
  - **Precision**: `0.556` (55.6%)
  - **Recall**: `0.833` (83.3%)
  - **F1 Score**: `0.667`
  - **False-Positive Cost**: `₹85,567` (8 test false positives)

---

## Tech Stack & Architecture

- **Backend**: Java 21 / 17, Spring Boot 3.3.4, Spring Data JPA, Hibernate, Springdoc OpenAPI 2.6.0 (Swagger UI).
- **Database**: 
  - Local/Dev: In-memory H2 database (zero setup).
  - Docker/Production: PostgreSQL 16 Alpine.
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Containerization**: Docker multi-stage builds (`maven:3.9-eclipse-temurin-21` & `eclipse-temurin:21-jre-alpine` for backend; `node:20-alpine` & `nginx:alpine` for frontend) and Docker Compose.
- **CI**: GitHub Actions workflow validating Maven verification and NPM build/lint in parallel.

---

## Quickstart Options

### Option 1: Local Development (H2 In-Memory, No Docker)

#### Prerequisites
- JDK 17 or 21
- Apache Maven 3.8+
- Node.js 20+ & npm

#### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
The backend starts on `http://localhost:8080` with the `default` profile (in-memory H2 database, automatically seeded).
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **H2 Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:mem:disputeshield`, user: `sa`, password: `""`)

#### 2. Start the Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The React frontend starts on `http://localhost:5173` (or `http://localhost:5174`).

---

### Option 2: Docker Compose (Postgres + Backend + Frontend)

To boot all 3 containers with a single command:

```bash
docker compose up --build
```

- **Frontend App**: [http://localhost](http://localhost) (or [http://localhost:3000](http://localhost:3000))
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **Postgres Database**: `localhost:5432`

---

## Authentication & API Key

DisputeShield uses lightweight shared API key authentication suitable for buildathon evaluations and automated testing:

- **Header**: `X-API-Key`
- **Default Demo Key**: `disputeshield-demo-key-2026`
- **Configuration Variable**: `DISPUTESHIELD_API_KEY`
- **Public Endpoints**:
  - `GET /api/evaluation/report` — **Unrestricted / No key required** so evaluators and judges can inspect held-out benchmark metrics directly.
  - `/swagger-ui/**`, `/v3/api-docs/**`, `/h2-console/**` — Developer tooling routes.

#### Example API Call
```bash
# Protected endpoint (requires X-API-Key)
curl -H "X-API-Key: disputeshield-demo-key-2026" http://localhost:8080/api/disputes

# Public benchmark endpoint (no key required)
curl http://localhost:8080/api/evaluation/report
```

> **Security Note / Known Limitation**: A single shared API key is used for demo and buildathon evaluation simplicity. For enterprise production deployments, this would be replaced by OAuth2 / OpenID Connect, JWT session tokens, and role-based multi-tenant access control.

---

## Environment Variables

| Variable | Description | Default (Local) | Docker Compose |
| :--- | :--- | :--- | :--- |
| `DISPUTESHIELD_API_KEY` | Shared API key for `/api/**` routes | `disputeshield-demo-key-2026` | `disputeshield-demo-key-2026` |
| `DISPUTESHIELD_CORS_ORIGINS` | Comma-separated allowed CORS origins | `http://localhost:5173,http://localhost:3000,http://localhost:8080` | `http://localhost,http://localhost:80,http://localhost:3000,http://localhost:5173` |
| `SPRING_PROFILES_ACTIVE` | Spring configuration profile (`default` or `docker`) | `default` (H2 DB) | `docker` (PostgreSQL) |
| `SPRING_DATASOURCE_URL` | JDBC Connection URL | `jdbc:h2:mem:disputeshield;...` | `jdbc:postgresql://postgres:5432/disputeshield` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `sa` | `disputeshield` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `""` | `disputeshield_secret` |
| `VITE_API_BASE_URL` | Base URL for frontend API calls | `http://localhost:8080` | `""` (proxied via Nginx) |
| `VITE_API_KEY` | API Key sent by frontend | `disputeshield-demo-key-2026` | `disputeshield-demo-key-2026` |

---

## Testing & Verification

### Backend Verification
```bash
cd backend
mvn -B verify
```
Runs the full suite of unit and Spring Boot MockMvc integration tests, verifying:
- Complete dispute lifecycle (analyze, packet generation, merchant approval, submission)
- Error handling (404 for unknown disputes, 400 for premature analysis/packet, 409 for duplicate submissions)
- API key authentication filters (401 for missing/invalid keys, 200 for valid key, public access to evaluation report)
- Exact Track 02 seed-42 held-out evaluation assertions (Precision: 0.556, Recall: 0.833, F1: 0.667, FP Cost: ₹85,567)

### Frontend Verification
```bash
cd frontend
npm run build
npm run lint
```
Validates TypeScript types (`tsc -b`), production bundle packaging (`vite build`), and code quality (`oxlint`).

---

## License
MIT License. Synthetic demo data only — no real payment or customer records used.
