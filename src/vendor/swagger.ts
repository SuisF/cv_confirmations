export const swaggerOptions = {
  info: {
    version: "1.0.0",
    title: "CV API Documentation",
    description: "CV API Typescript",
    license: {
      name: "MIT",
    },
  },
  security: {
    BearerAuth: {
      type: "http",
      scheme: "bearer",
    },
  },
  baseDir: __dirname,
  filesPattern: "../controller/*.ts",
  swaggerUIPath: "/api-docs",
  exposeSwaggerUI: true,
  exposeApiDocs: false,
  apiDocsPath: "/v1/api-docs",
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
  multiple: true,
};
