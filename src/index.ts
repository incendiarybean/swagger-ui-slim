import type { NextFunction, Request, Response } from "express";

const express = require("express");
const swaggerUi = require("swagger-ui-dist");
let swaggerInit = "";

/* DECLARE TYPES */
interface SwaggerOptions {
    swaggerUrl?: string;
    customSiteTitle?: string;
    favicon_url?: string;
}

/* DECLARE TEMPLATES */
const SwaggerOnloadTemplate: string = `
window.onload = () => {
    <% swaggerOptions %>

    const UrlMatch = window.location.search.match(/url=([^&]+)/);
    let url;
    if (UrlMatch && UrlMatch.length > 1) {
        url = decodeURIComponent(UrlMatch[1]);
    } else {
        url = window.location.origin;
    }

    window.ui = SwaggerUIBundle({
        url: url,
        spec: options.swaggerDoc,
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: "StandaloneLayout",
    });
};
`;

const SwaggerUiTemplate: string = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><% title %></title>
    <link rel="stylesheet" type="text/css" href="./swagger-ui.css" />
    <link rel="stylesheet" type="text/css" href="index.css" />
    <% favicon %>
</head>

<body>
    <div id="swagger-ui"></div>
    
    <script src="./swagger-ui-bundle.js"> </script>
    <script src="./swagger-ui-standalone-preset.js"> </script>
    <script src="./swagger-ui-init.js"> </script>
    <% customJs %>
</body>
</html>
`;

/* FORMAT FUNCTIONS */
const generateHTML = (
    swaggerDoc: any,
    { swaggerUrl, customSiteTitle, favicon_url }: SwaggerOptions
) => {
    let SwaggerHTML;

    const initOptions = {
        swaggerDoc: swaggerDoc || undefined,
        customOptions: {},
        swaggerUrl: swaggerUrl || undefined,
    };

    SwaggerHTML = SwaggerUiTemplate.replace(
        "<% favicon %>",
        `<link rel="icon" type="image/png" href="${
            favicon_url || "./favicon-32x32.png"
        }" />`
    );

    swaggerInit = SwaggerOnloadTemplate.replace(
        "<% swaggerOptions %>",
        stringify(initOptions)
    );
    return SwaggerHTML.replace("<% title %>", customSiteTitle || "Swagger UI");
};

const build = (swaggerJson: any, opts?: SwaggerOptions) => {
    const options = opts || {};

    const openApiVersion = swaggerJson.openapi.split(".")[0];
    if (openApiVersion !== "3") {
        console.warn(
            "\x1b[33m%s\x1b[0m",
            "[SWAGGER-UI-SLIM] This Slim-UI was designed around OpenAPI:3.0.0, any other version may not perform as intended."
        );
    }

    const html = generateHTML(swaggerJson, options);
    return (req: Request, res: Response) => {
        res.send(html);
    };
};

const routeHandler = (req: Request, res: Response, next: NextFunction) => {
    if (req.path === "/package.json") {
        res.status(404).json({ message: "Not found." });
    } else if (req.path === "/swagger-ui-init.js") {
        res.set("Content-Type", "application/javascript");
        res.send(swaggerInit);
    } else {
        next();
    }
};

const serveAssets = () => {
    return express.static(swaggerUi.getAbsoluteFSPath(), { index: false });
};

const serve = [routeHandler, serveAssets()];

const stringify = function (obj: any) {
    const placeholder = "____FUNCTIONPLACEHOLDER____";
    const fns: any = [];
    let json = JSON.stringify(
        obj,
        (key, value) => {
            if (typeof value === "function") {
                fns.push(value);
                return placeholder;
            }
            return value;
        },
        2
    );
    json = json.replace(new RegExp('"' + placeholder + '"', "g"), function (_) {
        return fns.shift();
    });
    return "const options = " + json + ";";
};

export { serve, build };
