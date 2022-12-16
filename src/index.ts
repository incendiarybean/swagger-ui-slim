import type { NextFunction, Request, RequestHandler, Response } from "express";

import type { OpenAPIV3 } from "openapi-types";

const express = require("express");
const swaggerUi = require("swagger-ui-dist");
let swaggerInit = "";

/* DECLARE TYPES */
interface SwaggerOptions {
    swaggerUrl?: string;
    customSiteTitle?: string;
    faviconUrl?: string;
}

/* DECLARE TEMPLATES */
const SwaggerOnloadTemplate: string = `
window.onload = () => {
    <% swaggerOptions %>
    
    let url = window.location.origin;
    const UrlMatch = window.location.search.match(/url=([^&]+)/);
    if (UrlMatch && UrlMatch.length > 1) {
        url = decodeURIComponent(UrlMatch[1]);
    }

    window.ui = SwaggerUIBundle({
        url: options.swaggerUrl || url,
        spec: options.swaggerDoc,
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: "BaseLayout",
    });
};
`;

const SwaggerUiTemplate: string = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><% title %></title>
    <style>
        html {
            overflow: auto !important;
            overflow-y: unset;
        }
        h2, span {
            font-weight: 100 !important;
        }
    </style>
    <link rel="stylesheet" type="text/css" href="./swagger-ui.css" />
    <link rel="stylesheet" type="text/css" href="index.css" />
    <% favicon %>
</head>

<body>
    <div id="swagger-ui"></div>
    
    <script src="./swagger-ui-bundle.js"> </script>
    <script src="./swagger-ui-standalone-preset.js"> </script>
    <script src="./display-schema.js"> </script>
</body>
</html>
`;

/* FORMAT FUNCTIONS */
const generateHTML = (
    swaggerDoc: OpenAPIV3.Document | undefined,
    { customSiteTitle, swaggerUrl, faviconUrl }: SwaggerOptions
) => {
    let SwaggerHTML;

    if (swaggerUrl) {
        swaggerDoc = undefined;
    }

    const initOptions = {
        swaggerDoc: swaggerDoc || undefined,
        swaggerUrl: swaggerUrl || undefined,
    };

    SwaggerHTML = SwaggerUiTemplate.replace(
        "<% favicon %>",
        `<link rel="icon" type="image/png" href="${
            faviconUrl || "./favicon-32x32.png"
        }" />`
    );

    swaggerInit = SwaggerOnloadTemplate.replace(
        "<% swaggerOptions %>",
        `const options = ${JSON.stringify(initOptions)};`
    );
    return [
        SwaggerHTML.replace("<% title %>", customSiteTitle || "Swagger UI"),
        swaggerInit,
    ];
};

const build = (
    spec: OpenAPIV3.Document,
    opts: SwaggerOptions
): RequestHandler => {
    opts = opts || {};
    spec = spec || {};

    if (!Object.keys(spec).length && !opts.swaggerUrl) {
        throw new Error("Neither 'spec' or 'opts.swaggerUrl' were provided.");
    }

    if (Object.keys(spec).length) {
        const openApiVersion = spec.openapi.split(".")[0];
        if (openApiVersion !== "3") {
            console.warn(
                "\x1b[33m%s\x1b[0m",
                "[SWAGGER-UI-SLIM] This Slim-UI was designed around OpenAPI:3.0.0, any other version may not perform as intended."
            );
        }
    }

    const html = generateHTML(spec, opts)[0];

    return (req: Request, res: Response) => {
        res.send(html);
    };
};

const routeHandler = (req: Request, res: Response, next: NextFunction) => {
    if (req.path === "/package.json") {
        return res.status(404).json({ message: "Not found." });
    } else if (req.path.endsWith("/display-schema.js")) {
        res.set("Content-Type", "application/javascript");
        return res.send(swaggerInit);
    }
    return next();
};

const serveAssets = () =>
    express.static(swaggerUi.getAbsoluteFSPath(), { index: false });

const serve = [routeHandler, serveAssets()];

export { serve, build, generateHTML };
