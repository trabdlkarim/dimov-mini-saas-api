import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import config from "./config/index.js";


const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Register Swagger docs route
app.use('/api-docs', config.swagger.swaggerUi.serve, config.swagger.swaggerUi.setup(config.swagger.specs));

// Register api endpoints
app.use("/api/", routes);

// Handle root path
app.get("/", (req, res) => {
  res.send("API is up and running... <br/> <a href='/api-docs'>Explore API</a>");
});


export default app;
