import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(projectRoot, "site");
const output = path.join(projectRoot, "dist");
const publicValue = (...names) => names.map((name) => process.env[name]?.trim()).find(Boolean) || "";

const runtimeConfig = {
  appOrigin: publicValue("VITE_APP_ORIGIN"),
  apiOrigin: publicValue("VITE_CLINICAL_API_URL"),
  sttWebSocketUrl: publicValue("VITE_STT_WEBSOCKET_URL"),
  calendarOrigin: publicValue("VITE_CALENDAR_ORIGIN") || "https://calendar.somasyncai.com",
  calendarApiOrigin: publicValue("VITE_CALENDAR_API_ORIGIN") || "https://calendar.somasyncai.com",
  betaLead: {
    supabaseUrl: publicValue("VITE_SUPABASE_PROJECT_URL", "VITE_SUPABASE_URL"),
    publishableKey: publicValue("VITE_SUPABASE_ANON_KEY", "VITE_SUPABASE_PUBLISHABLE_KEY")
  },
  bluetooth: {
    namePrefix: publicValue("VITE_BLUETOOTH_NAME_PREFIX") || "SomaSync",
    serviceUuid: publicValue("VITE_BLUETOOTH_SERVICE_UUID"),
    telemetryCharacteristicUuid: publicValue("VITE_BLUETOOTH_TELEMETRY_CHARACTERISTIC_UUID"),
    controlCharacteristicUuid: publicValue("VITE_BLUETOOTH_CONTROL_CHARACTERISTIC_UUID")
  },
  audio: {
    targetSampleRate: Number(publicValue("VITE_AUDIO_SAMPLE_RATE")) || 16000,
    chunkMilliseconds: Number(publicValue("VITE_AUDIO_CHUNK_MILLISECONDS")) || 80
  }
};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
await writeFile(
  path.join(output, "assets", "runtime-config.js"),
  `/* Generated at build time. Public configuration only; no secrets. */\nwindow.SomaSyncRuntimeConfig = Object.freeze(${JSON.stringify(runtimeConfig, null, 2)});\n`
);
console.log(`Copied framework-free client from ${source} to ${output}`);
