# SomaSync Clinical API

This Express service is the server-side boundary for transcription and SOAP-note generation. The static c-bot browser sends audio and transcript content to this API after a signed-in user session is verified. The API—not the browser—holds Deepgram, AWS, and database credentials.

## Local Setup

Copy `.env.example` to `.env`, install dependencies with `npm install`, then run `npm run check` and `npm run dev`. Initialize the database with `psql "$DATABASE_URL" -f db/schema.sql`. Local testing must use synthetic data only.

## Deployment Controls

Deploy behind AWS API Gateway or an Application Load Balancer using HTTPS. Configure a private encrypted RDS PostgreSQL instance, validate the RDS certificate, give the runtime an IAM role limited to the approved Bedrock model, and hold keys in AWS Secrets Manager. Set `REQUIRE_HTTPS=true` outside local development.

> **PHI boundary:** This repository is not authorization to process PHI. Do not enable PHI until the applicable BAAs, vendor configurations, security program, risk analysis, training, and organizational approval are complete.
