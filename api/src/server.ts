import { app } from "./app.js";
import { config } from "./config.js";
app.listen(config.PORT, () => { console.log(`SomaSync clinical API listening on port ${config.PORT}`); });
