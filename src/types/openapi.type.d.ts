declare interface OpenAPISchema {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths: PathsObject;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
}

declare interface InfoObject {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: ContactObject;
  license?: LicenseObject;
  version: string;
}

declare interface ContactObject {
  name?: string;
  url?: string;
  email?: string;
}

declare interface LicenseObject {
  name: string;
  url?: string;
}

declare interface ServerObject {
  url: string;
  description?: string;
  variables?: { [variable: string]: ServerVariableObject };
}

declare interface ServerVariableObject {
  enum?: string[];
  default: string;
  description?: string;
}

declare interface PathsObject {
  [path: string]: PathItemObject;
}

declare interface PathItemObject {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
  servers?: ServerObject[];
  parameters?: (ParameterObject | ReferenceObject)[];
}

declare interface OperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  parameters?: (ParameterObject | ReferenceObject)[];
  requestBody?: RequestBodyObject;
  responses: ResponsesObject;
  callbacks?: { [callback: string]: CallbackObject };
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
  servers?: ServerObject[];
}

declare interface ExternalDocumentationObject {
  description?: string;
  url: string;
}

declare interface ParameterObject {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: SchemaObject | ReferenceObject;
  example?: any;
  examples?: { [media: string]: ExampleObject | ReferenceObject };
  content?: { [media: string]: MediaTypeObject };
}

declare interface RequestBodyObject {
  description?: string;
  content: { [media: string]: MediaTypeObject };
  required?: boolean;
}

declare interface MediaTypeObject {
  schema?: SchemaObject | ReferenceObject;
  example?: any;
  examples?: { [media: string]: ExampleObject | ReferenceObject };
  encoding?: { [media: string]: EncodingObject };
}

declare interface EncodingObject {
  contentType?: string;
  headers?: { [header: string]: HeaderObject | ReferenceObject };
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

declare interface ResponsesObject {
  [statusCode: string]: ResponseObject | ReferenceObject;
}

declare interface ResponseObject {
  description: string;
  headers?: { [header: string]: HeaderObject | ReferenceObject };
  content?: { [media: string]: MediaTypeObject };
  links?: { [link: string]: LinkObject | ReferenceObject };
}

declare interface CallbackObject {
  [callback: string]: PathItemObject;
}

declare interface ExampleObject {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

declare interface LinkObject {
  operationRef?: string;
  operationId?: string;
  parameters?: { [parameter: string]: any };
  requestBody?: any;
  description?: string;
  server?: ServerObject;
}

declare interface HeaderObject extends ParameterObject {}

declare interface TagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
}

declare interface ReferenceObject {
  $ref: string;
}

declare interface SchemaObject {
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
  type?: string;
  allOf?: (SchemaObject | ReferenceObject)[];
  oneOf?: (SchemaObject | ReferenceObject)[];
  anyOf?: (SchemaObject | ReferenceObject)[];
  not?: SchemaObject | ReferenceObject;
  items?: SchemaObject | ReferenceObject;
  properties?: { [property: string]: SchemaObject | ReferenceObject };
  additionalProperties?: boolean | SchemaObject | ReferenceObject;
  description?: string;
  format?: string;
  default?: any;
  nullable?: boolean;
  discriminator?: DiscriminatorObject;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: XMLObject;
  externalDocs?: ExternalDocumentationObject;
  example?: any;
  deprecated?: boolean;
}

declare interface DiscriminatorObject {
  propertyName: string;
  mapping?: { [value: string]: string };
}

declare interface XMLObject {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

declare interface SecurityRequirementObject {
  [name: string]: string[];
}

declare interface ComponentsObject {
  schemas?: { [key: string]: SchemaObject | ReferenceObject };
  responses?: { [key: string]: ResponseObject | ReferenceObject };
  parameters?: { [key: string]: ParameterObject | ReferenceObject };
  examples?: { [key: string]: ExampleObject | ReferenceObject };
  requestBodies?: { [key: string]: RequestBodyObject | ReferenceObject };
  headers?: { [key: string]: HeaderObject | ReferenceObject };
  securitySchemes?: { [key: string]: SecuritySchemeObject | ReferenceObject };
  links?: { [key: string]: LinkObject | ReferenceObject };
  callbacks?: { [key: string]: CallbackObject | ReferenceObject };
}

declare interface SecuritySchemeObject {
  type: string;
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
  bearerFormat?: string;
  flows?: OAuthFlowsObject;
  openIdConnectUrl?: string;
}

declare interface OAuthFlowsObject {
  implicit?: OAuthFlowObject;
  password?: OAuthFlowObject;
  clientCredentials?: OAuthFlowObject;
  authorizationCode?: OAuthFlowObject;
}

declare interface OAuthFlowObject {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: { [scope: string]: string };
}
