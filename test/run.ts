const express = require("express");
import { OpenAPIV3 } from "openapi-types";
import { serve, build } from "../src/index";
import spec from "./test-schema.json";

const app = express();

app.use(
    "/api-docs",
    serve,
    build(spec as OpenAPIV3.Document, {
        swaggerUrl: undefined,
    })
);

app.listen(3000, () => {
    console.log("Server is open!");
});
