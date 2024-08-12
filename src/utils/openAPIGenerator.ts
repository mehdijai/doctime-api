import appConfig from '@/config/app.config';
import { config } from 'dotenv';
config();

export class OpenAPIDocInstance {
  static openApi: OpenAPIDocument;
  static getInstance() {
    if (!this.openApi) {
      this.openApi = new OpenAPIDocument();
    }
    return this.openApi;
  }
}

export class OpenAPIDocument implements OpenAPISchema {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths: PathsObject;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;

  constructor() {
    this.openapi = '3.0.0';
    this.info = {
      title: appConfig.appName,
      version: appConfig.apiVersion,
    };
    this.servers = [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ];
    this.externalDocs = {
      description: 'swagger.json',
      url: '/swagger.json',
    };
    this.paths = {};
    this.components = {
      schemas: {},
      parameters: {},
      responses: {},
      requestBodies: {},
      headers: {},
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      examples: {},
      links: {},
      callbacks: {},
    };
  }

  addSchema(name: string, schema: SchemaObject | ReferenceObject): void {
    if (!this.components) {
      this.components = {};
    }
    if (!this.components.schemas) {
      this.components.schemas = {};
    }
    this.components.schemas[name] = schema;
  }

  addParameter(name: string, parameter: ParameterObject | ReferenceObject): void {
    if (!this.components) {
      this.components = {};
    }
    if (!this.components.parameters) {
      this.components.parameters = {};
    }
    this.components.parameters[name] = parameter;
  }

  addPath(path: string, pathItem: PathItemObject): void {
    if (this.paths[path]) {
      this.paths[path] = { ...pathItem, ...this.paths[path] };
    } else {
      this.paths[path] = pathItem;
    }
  }

  addResponse(name: string, response: ResponseObject | ReferenceObject): void {
    if (!this.components) {
      this.components = {};
    }
    if (!this.components.responses) {
      this.components.responses = {};
    }
    this.components.responses[name] = response;
  }

  addRequestBody(name: string, requestBody: RequestBodyObject | ReferenceObject): void {
    if (!this.components) {
      this.components = {};
    }
    if (!this.components.requestBodies) {
      this.components.requestBodies = {};
    }
    this.components.requestBodies[name] = requestBody;
  }

  addHeader(name: string, header: HeaderObject | ReferenceObject): void {
    if (!this.components) {
      this.components = {};
    }
    if (!this.components.headers) {
      this.components.headers = {};
    }
    this.components.headers[name] = header;
  }

  addSecurityScheme(name: string, securityScheme: SecuritySchemeObject | ReferenceObject): void {
    if (!this.components) {
      this.components = {};
    }
    if (!this.components.securitySchemes) {
      this.components.securitySchemes = {};
    }
    this.components.securitySchemes[name] = securityScheme;
  }

  addExample(name: string, example: ExampleObject | ReferenceObject): void {
    if (!this.components) {
      this.components = {};
    }
    if (!this.components.examples) {
      this.components.examples = {};
    }
    this.components.examples[name] = example;
  }

  addLink(name: string, link: LinkObject | ReferenceObject): void {
    if (!this.components) {
      this.components = {};
    }
    if (!this.components.links) {
      this.components.links = {};
    }
    this.components.links[name] = link;
  }

  addCallback(name: string, callback: CallbackObject | ReferenceObject): void {
    if (!this.components) {
      this.components = {};
    }
    if (!this.components.callbacks) {
      this.components.callbacks = {};
    }
    this.components.callbacks[name] = callback;
  }

  addTag(tag: TagObject): void {
    if (!this.tags) {
      this.tags = [];
    }
    this.tags.push(tag);
  }

  addSecurityRequirement(securityRequirement: SecurityRequirementObject): void {
    if (!this.security) {
      this.security = [];
    }
    this.security.push(securityRequirement);
  }
}
