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


**From dispute alert to evidence-ready defense in seconds.**
<br>
[**Live Demo**](https://dispute-sheild.vercel.app/)
<br>

<img width="1512" height="872" alt="image" src="https://github.com/user-attachments/assets/e75f359f-6531-4abe-8694-c54080bf8446" />

</div>


<br/>
DisputeShield AI helps merchants investigate payment chargebacks, identify the strongest available evidence, detect critical gaps, and prepare structured defense packets for human review.

---


## Product Preview

### Investigation Dashboard

<img width="1542" height="1021" alt="image" src="https://github.com/user-attachments/assets/248e6c6e-8a0e-43bb-92f3-ce68a7a045bb" />

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
## 1-Click Demo Access

The demo provides three pre-seeded roles, each showing a different part of the chargeback defense workflow.
**No account is required** for demo access **choose a pre-seeded role** and explore the platform instantly.
<div align="center">

<img src="https://github.com/user-attachments/assets/2b97cf0c-c8d3-4130-a889-56ccf0bdea3f" width="49%">
<img src="https://github.com/user-attachments/assets/7f44769c-8848-40da-a22b-70952c4a224e" width="49%">

</div>

<div align="center">

<table>
<tr>
<th> Investigator</th>
<th> Reviewer</th>
<th> Admin</th>
</tr>
<br>
<tr>
<td width="33%">
<img src="https://github.com/user-attachments/assets/8e70a018-c115-4bea-9d13-a4ed89032870" width="100%">
Runs the 7-stage investigation, analyzes evidence, applies ML-assisted scoring, and prepares defense packets.
</td>

<td width="33%">
<img src="https://github.com/user-attachments/assets/8a4245c8-a96d-4d03-856d-10f2f60ea2e8" width="100%">
Audits evidence, reviews & approves defense packets, and approves or submits the final response.
</td>

<td width="33%">
<img src="https://github.com/user-attachments/assets/901b6be7-9d1f-4e51-a65e-8a4b36cef9a4" width="100%">
Manages disputes, investigation workflows, defense packets, users, and security settings.
</td>
</tr>

</table>

</div>

**Human-controlled:** AI provides investigation and decision support, while final defense submission remains under merchant approval.

---
## The Problem

When a merchant receives a chargeback, they often have limited time to investigate the dispute, find the right evidence, and prepare a response. Evidence can be scattered across transactions, orders, delivery records, customer support conversations, and fraud signals.

Missing the right evidence can mean losing money even when the merchant has a valid defense.

---
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
React + TypeScript + Vite
        │
        │ REST API
        ▼
Spring Boot Backend
        │
        ├── Authentication & Security
        │     ├── JWT Authentication
        │     └── Role-Based Access Control
        │
        ├── Dispute Service
        │     │
        │     ├── Dispute Management
        │     ├── Evidence Analysis
        │     ├── Defense Packet Generation
        │     └── Audit Trail
        │
        ├── Rule Engine
        │     ├── Dispute Context
        │     ├── Dispute Features
        │     └── Evidence Rules
        │
        ├── ML Evaluation
        │     ├── Synthetic Dataset Generation
        │     └── Logistic Regression
        │
        ├── REST Controllers
        │     ├── Authentication
        │     ├── Disputes
        │     ├── Evaluation
        │     └── Settings
        │
        ▼
JPA / Hibernate
        │
        ▼
H2 / PostgreSQL
```

## Authentication & Role-Based Access Control (RBAC)

DisputeShield AI uses **JWT-based authentication** with Spring Security and role-based access control.

### Supported Roles & Permissions

| Capability | ADMIN | INVESTIGATOR | REVIEWER |
|---|:---:|:---:|:---:|
| **View Disputes** | ✅ | ✅ | ✅ |
| **View Analysis** | ✅ | ✅ | ❌ |
| **View Audit Trail** | ✅ | ✅ | ✅ |
| **Run Investigation** | ✅ | ✅ | ❌ |
| **Generate Defense Packet** | ✅ | ✅ | ❌ |
| **Approve Defense Packet** | ✅ | ❌ | ✅ |
| **Submit Response** | ✅ | ❌ | ✅ |
| **Evaluation / ML** | ✅ | ✅ | ❌ |
| **Platform Settings** | ✅ | ❌ | ❌ |

---

## ML Evaluation

DisputeShield AI includes a reproducible synthetic benchmark for evaluating its ML-assisted evidence sufficiency scoring.

| Metric | Result |
|---|---:|
| **Precision** | **55.6%** |
| **Recall** | **83.3%** |
| **F1 Score** | **0.667** |
| **False-Positive Cost** | **₹85,567** |

**Dataset:** 200 synthetic disputes · 160 training cases · 40 held-out test cases · Seed 42

The ML model is used as **decision support**, not as an autonomous final decision-maker.

---
## Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-Icons-F56565?style=for-the-badge)

### Backend

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)

### Database

![H2](https://img.shields.io/badge/H2-1E90FF?style=for-the-badge&logo=h2&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

### Security & API

![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)

### Infrastructure & CI

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

---
## Quick Start

### Run Locally

### Backend
```bash
cd backend
mvn spring-boot:run
```

In another terminal:

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Run with Docker

```bash
docker compose up --build
```

The local setup uses **H2**, while the Docker setup uses **PostgreSQL**.

---


## Built for Defense

- **Explainable** — Evidence decisions can be understood.
- **Human-controlled** — Final defense actions require human approval.
- **Auditable** — The dispute lifecycle is recorded.
- **Defense-focused** — Built for legitimate merchant dispute operations.

---

## License

MIT License.

> **Synthetic demonstration data only. No real payment or customer records are used.**
