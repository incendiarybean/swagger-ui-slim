const express = require("express");
import { serve, build } from "../src/index";
import swaggerJson from "./test-schema.json";

const app = express();

app.use("/api-docs", serve, build(swaggerJson));

app.listen(3000, () => {
    console.log("Server is open!");
});
