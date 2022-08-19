const express = require("express");
import { OpenAPIV3 } from "openapi-types";
import { serve, build } from "../src/index";
import { schema } from "./test.data";

const app = express();

app.use(
    "/api-docs",
    serve,
    build(schema as OpenAPIV3.Document, {
        swaggerUrl: undefined,
    })
);

app.listen(3000, () => {
    console.log("Server is open!");
});
