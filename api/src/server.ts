import http from "node:http";
import { app } from "./app.js";
import { config } from "./config.js";
import { attachVoiceRealtimeServer } from "./realtime.js";

const server = http.createServer(app);
attachVoiceRealtimeServer(server);
server.listen(config.PORT, () => console.log(`SomaSync clinical API listening on ${config.PORT}`));
