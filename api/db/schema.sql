-- Apply only to a private, encrypted PostgreSQL/RDS instance. Enforce TLS at connection time and retain current RDS CA validation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS therapists (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), external_subject_hash CHAR(64) UNIQUE NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS clients (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE, pseudonymous_reference CHAR(64) NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE (therapist_id, pseudonymous_reference));
CREATE TABLE IF NOT EXISTS sessions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE RESTRICT, client_id UUID REFERENCES clients(id) ON DELETE SET NULL, encrypted_transcript BYTEA, encrypted_soap_note BYTEA, encryption_key_version TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), finalized_at TIMESTAMPTZ);
CREATE TABLE IF NOT EXISTS beta_leads (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT UNIQUE NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS sessions_therapist_created_idx ON sessions (therapist_id, created_at DESC);
-- Database credentials must be least-privilege. Create separate migration and runtime roles; do not use the RDS master user at runtime.
