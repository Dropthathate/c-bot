# AWS Deployment Handoff

## Recommended Target

Deploy the clinical API as a container behind an Application Load Balancer or API Gateway, using a private runtime network path to Amazon RDS PostgreSQL. Terminate TLS at the AWS edge, forward the original protocol, set `REQUIRE_HTTPS=true`, and only allow the published frontend origins through `CORS_ORIGINS`. The container image can be built from `api/Dockerfile` and deployed to ECS/Fargate or an EC2-managed container runtime.

| Component | Required production configuration |
| --- | --- |
| Compute | Non-public workload identity with an IAM role restricted to `bedrock:InvokeModel` for the approved model only. |
| Secrets | Store Deepgram credentials, database URL, CA bundle, and configuration values in AWS Secrets Manager or Parameter Store; never copy them into a client bundle or image layer. |
| Database | Private encrypted RDS PostgreSQL with TLS validation, separate migration/runtime roles, encrypted backups, backup restoration testing, and a documented retention policy. |
| Network | HTTPS-only ingress; private RDS subnets; security groups limited to the API runtime; no public database endpoint. |
| Logs | Structured server logs with request bodies and authorization headers redacted. Configure a retention period and verify that PHI is excluded. |
| Monitoring | Health checks at `/healthz`, alerting for errors/auth failures, and an approved incident-response escalation path. |

## Release Sequence

First provision the AWS account controls, final vendor configuration, signed agreements, and documented risk analysis. Then deploy the API with synthetic-only test data, verify that the browser calls the API rather than any vendor function, exercise access controls and incident handling, and collect acceptance evidence in `c-bot/docs/PRODUCTION_ACCEPTANCE.md`. Only an authorized organizational decision may change the beta’s no-PHI boundary.

## Required Environment Values

Use `api/.env.example` as the variable inventory. In production, set `DB_SSL=true` and supply the current RDS CA in `DB_CA_CERT_BASE64`; set exact public origins in `CORS_ORIGINS`; and set the Supabase issuer, audience, and JWKS URL to match the configured identity service. Rotate secrets through the secret-management process instead of editing containers.
