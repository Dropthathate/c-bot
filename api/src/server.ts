import http from "node:http";
import { app } from "./app.js";
import { config } from "./config.js";
import { attachVoiceRealtimeServer } from "./realtime.js";
import { ensureIntakeSchema } from "./services/intake-store.js";

const server = http.createServer(app);
attachVoiceRealtimeServer(server);
ensureIntakeSchema()
  .then(() => server.listen(config.PORT, () => console.log(`SomaSync clinical gateway listening on ${config.PORT}`)))
  .catch((error) => {
    console.error("Intake schema bootstrap failed; API will start but persistent intake remains unavailable.", error);
    server.listen(config.PORT, () => console.log(`SomaSync clinical gateway listening on ${config.PORT}`));
  });
