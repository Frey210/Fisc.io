# Product Requirements Document (PRD)

**Project Name:** Fisc.io – Smart Omnichannel Cash Flow & Wealth Analytics
**Lead Engineer:** Fariz Achmad Faizal
**Document Status:** Approved for Development
**Target Deployment:** `fisc.farlabs.my.id` (via Vercel)
**Github:** https://github.com/Frey210/Fisc.io.git

---

## 1. Executive Summary

Fisc.io is a dual-interface financial operations platform designed for zero-friction data entry and executive-level analytics. By combining a Telegram Bot for instant, on-the-go data capture (via OCR and NLP) with a Next.js Progressive Web App (PWA) for deep visual analytics, the system eliminates the friction of traditional expense trackers. The architecture leverages Vercel Serverless Functions and Supabase PostgreSQL to deliver a production-ready, highly available application at zero operational cost.

## 2. Core Objectives

* **Zero-Friction User Experience:** Enable users to log expenses, incomes, and savings transfers in under 3 seconds using natural language or image uploads directly via Telegram.
* **Automated Intelligence:** Utilize OCR and text parsing to automatically categorize transactions (e.g., automatically tagging "Esteh Indonesia" or "Kopi Padu Rasa" as F&B).
* **Engineering Portfolio Value:** Showcase advanced system design, webhook event handling, automated ETL pipelines, and cloud-native serverless architecture.

## 3. System Architecture: The Dual-Interface Model

### A. Interface 1: Telegram Bot (The Ingestion Layer)

Serves as the primary data entry point to capture transactions organically.

* **Manual Text Parsing (NLP Regex):**
* Default (Expense): `50000 makan di Golqi Chicken` → Logs as `EXPENSE`.
* Income (+): `+8000000 gaji bulan ini` → Logs as `INCOME`.
* Transfer (>): `> 1000000 dana darurat` → Logs as `TRANSFER`.


* **Receipt OCR Pipeline:** Users upload a photo of a receipt. The Vercel webhook sends the image to an OCR engine (Tesseract/Google Vision), extracts the date, merchant name, and total amount, and logs it as an `EXPENSE` with a confidence score.

### B. Interface 2: Next.js PWA Dashboard (The Analytics Layer)

A modern web dashboard accessible across all devices for reviewing data and extracting insights.

* **Executive Metrics (Widgets):**
* *Net Cash Flow:* Monthly Income vs. Expense visual comparison.
* *Savings Rate:* Percentage of income successfully transferred to savings.
* *Financial Runway:* `(Total Savings) / (Average Monthly Burn Rate)` = Estimated months of survival without income.


* **Heatmap & Trends:** Visualizing spending intensity across the days of the week.
* **Transaction Review:** Interface to manually edit, approve, or re-categorize OCR-processed receipts.

## 4. Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend & API Gateway** | Next.js (App Router) | Single repository for the React dashboard and Serverless API endpoints (webhooks). |
| **UI Components** | Tailwind CSS + Shadcn UI | Enterprise-grade, minimalist design system out-of-the-box. |
| **Data Visualization** | Tremor | React library optimized specifically for analytical dashboards. |
| **Database & Identity** | Supabase (PostgreSQL + Auth) | Relational data storage, Row Level Security (RLS), and Google OAuth integration. |
| **Data Extraction** | Tesseract.js / Vision API | Optical Character Recognition for receipt processing. |

## 5. Database Architecture (Supabase)

The core data model revolves around an extensible transaction table utilizing custom ENUMs.

* **Custom ENUM Type:** `transaction_type` (`INCOME`, `EXPENSE`, `TRANSFER`)
* **Table: `categories**`
* `id` (UUID, PK)
* `user_id` (UUID, FK -> users)
* `name` (Text) - e.g., F&B, Salary, Server Hosting, Emergency Fund
* `type` (transaction_type) - Maps the category to its primary behavior


* **Table: `transactions**`
* `id` (UUID, PK)
* `user_id` (UUID, FK -> users)
* `type` (transaction_type)
* `amount` (Decimal)
* `date` (Timestamp)
* `description` (Text)
* `category_id` (UUID, FK -> categories)
* `source` (Enum: `telegram_ocr`, `telegram_text`, `web_manual`)
* `confidence_score` (Float) - Used to flag OCR transactions that need human review (< 0.85).


* **Table: `telegram_links**`
* `user_id` (UUID, FK -> users)
* `telegram_chat_id` (BigInt, Unique) - Maps a Telegram user to their Fisc.io account.



## 6. Development Roadmap

* **Phase 1: Cloud Foundation & Database**
* Initialize the Next.js project and deploy to Vercel.
* Provision Supabase project, execute SQL schema, and configure Row Level Security.


* **Phase 2: Ingestion Pipeline**
* Register the Telegram Bot token and configure the Vercel webhook endpoint.
* Implement Regex parsing for standard text inputs (`+`, `>`, and default).
* Implement the link flow to connect a Telegram `chat_id` to a Supabase `user_id`.


* **Phase 3: OCR Integration**
* Add image handling to the Telegram webhook.
* Integrate OCR extraction logic and save draft data with confidence scores.


* **Phase 4: Dashboard & Analytics**
* Build the Next.js dashboard using Tremor components.
* Implement the Financial Runway, Savings Rate, and Cash Flow metrics.
* Configure PWA manifest for mobile installability.