const express = require("express");
import { serve, build } from "../src/index";
import spec from "./test-schema.json";

const app = express();

app.use(
    "/api-docs",
    serve,
    build(spec, {
        swaggerUrl: null,
    })
);

app.listen(3000, () => {
    console.log("Server is open!");
});
