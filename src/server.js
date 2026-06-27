import config from "./config/index.js";
import app from "./app.js";

async function run() {
  try {
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
      console.log(
        `API docs available at http://localhost:${config.port}/api-docs`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

run();