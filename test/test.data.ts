export const schema = {
    openapi: "3.0.0",
    info: {
        title: "Test API",
        version: "0.1.0",
    },
    servers: [
        {
            url: "http://server:8080/",
            description: "Local build",
        },
    ],
    tags: [
        {
            name: "Tag",
            description: "This is a tag description.",
        },
    ],
    components: {
        schemas: {
            test: {
                required: ["message"],
                properties: {
                    message: { type: "string" },
                },
            },
        },
    },
    security: [{ APIKeyAuth: [] }],
    paths: {
        "/api/test": {
            get: {
                tags: ["Test"],
                summary: "Returns test!",
                responses: {
                    "200": {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/test",
                                },
                            },
                        },
                    },
                    default: {
                        description: "Error",
                        content: {
                            "application/json": {
                                schema: {
                                    required: ["message"],
                                    properties: {
                                        message: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const swagger_options_with_spec = {
    deepLinking: true,
    dom_id: "#swagger-ui",
    layout: "BaseLayout",
    plugins: ["localhost"],
    presets: [["apis"]],
    spec: schema,
    url: "localhost",
};

export const swagger_options_without_spec = {
    deepLinking: true,
    dom_id: "#swagger-ui",
    layout: "BaseLayout",
    plugins: ["localhost"],
    presets: [["apis"]],
    spec: undefined,
    url: "https://petstore.swagger.io/v2/swagger.json",
};
