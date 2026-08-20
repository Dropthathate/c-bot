import { Pool } from "pg";
import { config } from "../config.js";
// Production connections require TLS and certificate validation. Use an RDS private endpoint and current RDS CA bundle.
export const database = new Pool({ connectionString: config.DATABASE_URL, ssl: config.DB_SSL ? { rejectUnauthorized: true, ca: config.dbCa } : false, max: 10, idleTimeoutMillis: 30_000 });
