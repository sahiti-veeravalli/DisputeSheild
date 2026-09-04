<div align="center">

# DisputeShield AI

### Intelligent Chargeback Defense. Evidence-Ready in Seconds.

[![Build](https://img.shields.io/github/actions/workflow/status/sahiti-veeravalli/DisputeSheild/ci.yml?branch=main&label=Build&style=for-the-badge)](https://github.com/sahiti-veeravalli/DisputeSheild/actions)
[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge)](https://www.java.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![License](https://img.shields.io/github/license/sahiti-veeravalli/DisputeSheild?style=for-the-badge)](https://github.com/sahiti-veeravalli/DisputeSheild/blob/main/LICENSE)

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

<br/>

**From dispute alert to evidence-ready defense — in seconds.**

</div>

---

> **DisputeShield AI helps merchants investigate payment chargebacks, identify the strongest available evidence, detect critical gaps, and prepare structured defense packets for human review.**

## The Problem

When a merchant receives a chargeback, they often have limited time to investigate the dispute, find the right evidence, and prepare a response. Evidence can be scattered across transactions, orders, delivery records, customer support conversations, and fraud signals.

Missing the right evidence can mean losing money — even when the merchant has a valid defense.

## The Solution

**DisputeShield AI** automates the first stage of chargeback defense.

It takes a dispute and:

1. Investigates the case using deterministic evidence rules
2. Finds and ranks relevant merchant evidence
3. Detects missing critical evidence
4. Assesses defense readiness
5. Uses ML-assisted probability scoring for evidence sufficiency
6. Builds a structured, review-ready defense packet
7. Keeps a complete audit trail

**The merchant stays in control. Nothing is submitted without human approval.**

---

## How It Works

```text
Dispute Alert
      |
      v
Evidence Investigation
      |
      v
Rules + ML Decision Support
      |
      v
Readiness Assessment
      |
      v
Human Review & Approval
      |
      v
Defense Packet Generated
      |
      v
Complete Audit Trail
```

The system combines **deterministic evidence investigation** with **ML-assisted decision support**, while keeping the final response under human control.

---

## What DisputeShield Does

| Capability | What Happens |
|---|---|
| **Investigates** | Maps the dispute reason to relevant merchant evidence |
| **Ranks** | Prioritizes evidence by relevance and strength |
| **Detects Gaps** | Identifies missing critical evidence |
| **Assesses Readiness** | Generates a clear defense readiness assessment |
| **Builds Packets** | Compiles structured, review-ready evidence |
| **Stays Explainable** | Records why evidence was selected and what happened |

### Supported Disputes

`Product Not Received` · `Fraudulent Transaction` · `Duplicate Charge` · `Product Not as Described`

---

## Architecture

```text
React + TypeScript (Vite)
        │
        │ Authorization: Bearer <JWT>
        ▼
Spring Security 6 (Stateless Filter Chain)
        │
        ├── ADMIN (Full access + Gateway Settings + User Mgmt)
        ├── INVESTIGATOR (7-Stage Rule Engine + ML Scoring + Packets)
        └── REVIEWER (Evidence Audit + Packet Approval & Scheme Submission)
        │
        ▼
Protected REST APIs (/api/disputes, /api/settings, /api/auth/me)
        │
   ┌────┴────┐
   │         │
   ▼         ▼
Rules & ML  Audit Trail
   │         │
   └────┬────┘
        │
        ▼
H2 (In-Memory) / PostgreSQL
```

---

## Authentication & Role-Based Access Control (RBAC)

DisputeShield AI includes end-to-end production-grade authentication with stateless **JSON Web Tokens (JWT)** and fine-grained **Role-Based Access Control (RBAC)** enforced at both the Spring Security filter chain and endpoint method levels (`@PreAuthorize`).

### Supported Roles & Permissions Matrix

| Capability / API Endpoint | ADMIN | INVESTIGATOR | REVIEWER |
|---|:---:|:---:|:---:|
| **Dispute Queue** (`GET /api/disputes`, `GET /api/disputes/{id}`) | ✅ | ✅ | ✅ |
| **Evidence Vault & Audit Trail** (`GET /api/disputes/{id}/audit`) | ✅ | ✅ | ✅ |
| **Analytics & Risk Intelligence** | ✅ | ✅ | ✅ |
| **AI Investigation & ML Sufficiency** (`POST /api/disputes/{id}/analyze`) | ✅ | ✅ | ❌ |
| **Defense Packet Generation** (`POST /api/disputes/{id}/packet`) | ✅ | ✅ | ❌ |
| **Defense Packet Approval** (`POST /api/disputes/{id}/approve`) | ✅ | ❌ | ✅ |
| **Payment Scheme Submission** (`POST /api/disputes/{id}/submit`) | ✅ | ❌ | ✅ |
| **Model Intelligence & Benchmark** (`GET /api/evaluation/report`) | ✅ | ✅ | ❌ |
| **Platform Gateway & Security Settings** (`GET/PUT /api/settings`) | ✅ | ❌ | ❌ |

### Pre-Seeded Demo Accounts (1-Click Login)

For development, testing, and judge evaluation, three deterministic demo accounts are pre-seeded with BCrypt password hashing:

| Role | Email | Password | Persona & Responsibilities |
|---|---|---|---|
| **Admin** | `admin@disputeshield.ai` | `Admin@1234` | **Sarah Connor** — Full system administration, payment gateways, risk thresholds |
| **Investigator** | `investigator@disputeshield.ai` | `Investigator@1234` | **Alex Rivera** — Rule engine investigation, ML sufficiency analysis, packet drafts |
| **Reviewer** | `reviewer@disputeshield.ai` | `Reviewer@1234` | **Elena Rostova** — Compliance verification, defense packet approval, scheme submission |

### Security Endpoints

- `POST /api/auth/register` — Creates a new account with BCrypt password encryption (defaults to `INVESTIGATOR` or selected role).
- `POST /api/auth/login` — Authenticates credentials and returns a signed HMAC-SHA256 JWT access token.
- `GET /api/auth/me` — Returns the profile and granted authorities for the active JWT session.
- `GET /api/evaluation/report` — Public endpoint for held-out benchmark validation (Seed 42).

### Environment Variables

| Variable | Default (Local / Dev) | Description |
|---|---|---|
| `JWT_SECRET` | *(Safe default development signature)* | Secret key for signing and validating HMAC-SHA256 JWTs |
| `JWT_EXPIRATION_MS` | `86400000` (24 Hours) | JWT token lifespan in milliseconds |
| `DISPUTESHIELD_CORS_ORIGINS` | `http://localhost:5173,...` | Allowed CORS origins for frontend client access |
| `SPRING_PROFILES_ACTIVE` | `default` (H2) / `docker` (Postgres) | Active Spring profile |

---

## ML Evaluation

DisputeShield includes a reproducible synthetic benchmark using a **logistic regression model**.

| Metric | Result |
|---|---:|
| **Precision** | **55.6%** |
| **Recall** | **83.3%** |
| **F1 Score** | **0.667** |
| **False-Positive Cost** | **₹85,567** |

**200 synthetic disputes · 160 training · 40 held-out test cases · Seed 42**

The model is evaluated **exclusively on held-out test data** and is used as **decision support**, not as an autonomous final decision-maker.

---

## Tech Stack

**Frontend**  
React 19 · TypeScript · Vite · Tailwind CSS · Lucide

**Backend**  
Java 21 · Spring Boot · Spring Data JPA · Hibernate

**Data**  
H2 · PostgreSQL

**Infrastructure**  
Docker · Docker Compose · GitHub Actions · Swagger / OpenAPI

---

## Quick Start

### Run Locally

```bash
# Backend
cd backend
mvn spring-boot:run
```

In another terminal:

```bash
# Frontend
cd frontend
npm install
npm run dev
```

### Run Everything with Docker

```bash
docker compose up --build
```

The local development setup uses an in-memory **H2** database, while the Docker deployment uses **PostgreSQL**.

---

## Verification

### Backend

```bash
cd backend
mvn -B verify
```

### Frontend

```bash
cd frontend
npm run build
npm run lint
```

---

## Built for Defense

**Explainable** — Evidence decisions can be understood

**Human-controlled** — Nothing is submitted without approval

**Auditable** — The dispute lifecycle is recorded

**Defense-only** — Built exclusively for legitimate merchant dispute response

---

<div align="center">

## DisputeShield AI

### Every chargeback deserves a defense.

*Built for intelligent, explainable merchant dispute operations.*

</div>

---

## License

MIT License.

**Synthetic demonstration data only. No real payment or customer records are used.**
