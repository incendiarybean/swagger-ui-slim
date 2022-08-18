# Swagger-UI-Slim

## Description

This Repo is a lightweight, no-config required, Express based Swagger-UI implementation.

It is designed for use with an Express hosted API.

All you require is an OpenAPI Spec in a JSON format!

## Usage

It works extremely similarly to Swagger-UI-Express with one big tweak - no extras.

```js
/* require */
const SwaggerUI = require("swagger-ui-slim");
const spec = require("openapi.json");

app.use("/api/docs", SwaggerUI.serve, SwaggerUI.build({ spec }));

/* or import! */

import { serve, build } from "swagger-ui-slim";
const spec = require("openapi.json");

app.use("/api/docs", serve, build({ spec }));
app.listen(3000);
```

Now you're read to go!

### Customisation

The following customisation is available:

-   Display from JSON spec
-   Display from URL provided spec
-   Provide Favicon & Title

See examples below:

```js
/* Displays spec from JSON provided and changes website's tab title/favicon */
const spec = {
    /* insert spec here */
};
const opts = {
    customSiteTitle: "Website Title",
    faviconUrl: "/favicon.ico",
};
app.use("/api/docs", SwaggerUI.serve, SwaggerUI.build(spec, opts));

/* Displays spec from JSON provided */
const spec = {
    /* insert spec here */
};
app.use("/api/docs", SwaggerUI.serve, SwaggerUI.build(spec));

/* Displays spec from URL provided in opts.swaggerUrl */
const opts = {
    customSiteTitle: "Website Title",
    swaggerUrl: "https://petstore.swagger.io/v2/swagger.json",
    faviconUrl: "/favicon.ico",
};
app.use("/api/docs", SwaggerUI.serve, SwaggerUI.build(null, opts));

/* Displays spec from from URL provided in opts.swaggerUrl and changes website's tab title/favicon */
const spec = {
    /* insert spec here */
};
const opts = {
    customSiteTitle: "Website Title",
    swaggerUrl: "https://petstore.swagger.io/v2/swagger.json",
    faviconUrl: "/favicon.ico",
};
app.use("/api/docs", SwaggerUI.serve, SwaggerUI.build(spec, opts));
```

**NOTE**: Passing "_opts.swaggerUrl_" will overwrite a given JSON spec and display the spec from the provided URL.

## Disclaimer

This Repo is a recreation of [Swagger-UI-Express](https://github.com/scottie1984/swagger-ui-express).

This UI is slightly smaller at 5.19KB vs Swagger-UI-Express' 20.9KB.

This does in this case mean less features.
