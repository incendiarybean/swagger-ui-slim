const SwaggerUI = require("../src");

import {
    schema,
    swagger_options_with_spec,
    swagger_options_without_spec,
} from "./test.data";

const SwaggerUiTemplate: string = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><% title %></title>
    <style>
        html {
            overflow: auto;
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

const flatten = (str: string) => JSON.stringify(str.replace(/\s/g, ""));

afterEach(() => {
    jest.clearAllMocks();
});

test("Build throws if no spec or url is provided", () => {
    try {
        SwaggerUI.build(null);
    } catch (e: any) {
        expect(e.toString()).toBe(
            "Error: Neither 'spec' or 'opts.swaggerUrl' were provided."
        );
    }
});

test("Build proceeds if only spec is provided", async () => {
    let manipulatedSwaggerUiTemplate = SwaggerUiTemplate.replace(
        "<% favicon %>",
        `<link rel="icon" type="image/png" href="./favicon-32x32.png"/>`
    ).replace("<% title %>", "SwaggerUI");

    const expectedHtml = flatten(manipulatedSwaggerUiTemplate);

    const req = {};
    const res = {
        send: async (actualHtml: string) => {
            expect(flatten(actualHtml)).toEqual(expectedHtml);
        },
    };

    const output = SwaggerUI.build(schema);
    output(req, res);
});

test("Build proceeds if only opt is provided", async () => {
    const opts = {
        customSiteTitle: "test",
        faviconUrl: "favTest",
        swaggerUrl: "http://test.com",
    };

    let manipulatedSwaggerUiTemplate = SwaggerUiTemplate.replace(
        "<% favicon %>",
        `<link rel="icon" type="image/png" href="favTest"/>`
    ).replace("<% title %>", "test");

    const expectedHtml = flatten(manipulatedSwaggerUiTemplate);

    const req = {};
    const res = {
        send: async (actualHtml: string) => {
            expect(flatten(actualHtml)).toEqual(expectedHtml);
        },
    };

    const output = SwaggerUI.build(null, opts);
    output(req, res);
});

test("Provided URL overwrites SP", async () => {
    // @ts-ignore TS6133
    const SwaggerUIStandalonePreset = jest.fn(() => "preset")();

    const SwaggerUIBundle: any = jest.fn().mockImplementation();
    SwaggerUIBundle.presets = { apis: ["apis"] };
    SwaggerUIBundle.plugins = { DownloadUrl: "localhost" };

    const generatedOutput = SwaggerUI.generateHTML(schema, {});

    const window = {
        ui: () => {},
        onload: () => {},
        location: {
            origin: "localhost",
            search: {
                match: jest.fn(() => []),
            },
        },
    };

    const script = generatedOutput[1];
    eval(script);
    window.onload();

    expect(SwaggerUIBundle).toBeCalledWith(swagger_options_with_spec);
});

test("Options match provided schema", async () => {
    // @ts-ignore TS6133
    const SwaggerUIStandalonePreset = jest.fn(() => "preset")();
    const SwaggerUIBundle: any = jest.fn().mockImplementation();

    SwaggerUIBundle.presets = { apis: ["apis"] };
    SwaggerUIBundle.plugins = { DownloadUrl: "localhost" };

    const generatedOutput = SwaggerUI.generateHTML(schema, {});

    const window = {
        ui: () => {},
        onload: () => {},
        location: {
            origin: "localhost",
            search: {
                match: jest.fn(() => []),
            },
        },
    };

    const script = generatedOutput[1];
    eval(script);
    window.onload();

    expect(SwaggerUIBundle).toBeCalledWith(swagger_options_with_spec);
});

test("Options match provided opts", async () => {
    // @ts-ignore TS6133
    const SwaggerUIStandalonePreset = jest.fn(() => "preset")();

    const SwaggerUIBundle: any = jest.fn().mockImplementation();
    SwaggerUIBundle.presets = { apis: ["apis"] };
    SwaggerUIBundle.plugins = { DownloadUrl: "localhost" };

    const generatedOutput = SwaggerUI.generateHTML(null, {
        swaggerUrl: "https://petstore.swagger.io/v2/swagger.json",
    });

    const window = {
        ui: () => {},
        onload: () => {},
        location: {
            origin: "localhost",
            search: {
                match: jest.fn(() => []),
            },
        },
    };

    const script = generatedOutput[1];
    eval(script);
    window.onload();

    expect(SwaggerUIBundle).toBeCalledWith(swagger_options_without_spec);
});
