import http from 'axios'
export default class OpenAPI {
  private static _instance:OpenAPI = new OpenAPI()
  public static get instance():OpenAPI {
    return OpenAPI._instance
  }

  public async init(url:string) {
    const c = (await http.get(url)).data
    this._config = c
  }

  private _config?:ISpec;
  public get config():ISpec | undefined {
    return this._config
  }

  public getOperation(path:string, method:string):IOperation {
    return this.config?.paths[path][method]
  }

  public getSchemaByRef(ref:string):ISchema {
    const keys = ref.split('/')
    const definitionsName:string = keys[keys.length - 1]
    const schemas = this.config?.components?.schemas
    if (schemas) {
      return schemas[definitionsName]
    } else {
      throw Error("can't find schema in components by ref: " + ref)
    }
  }
  
  public getAllTags() {
    return this.config?.tags || []
  }

  public getOneTagInfo(name: string) {
    let tagInfo: any = null
    if (this.config?.tags) {
      this.config?.tags.forEach(tag => {
        if (tag.name === name) {
          tagInfo = tag
        }
      })
    }
    return tagInfo
  }
}

export interface Info {
  title: string
  version: string
  description?: string
  termsOfService?: string
  contact?: IContact
  license?: ILicense
  routers?: IOpenAPIRouter[]
}

export interface IContact {
  name?: string
  email?: string
  url?: string
}

export interface ILicense {
  name: string
  url?: string
}

export interface IExternalDocs {
  url: string
  description?: string
}

export interface ITagPageAction {
  path: string
  method: string
}

export interface ITagPage {
  type: string
  init?: ITagPageAction
  page?: { [key: string]: ITagPageAction | ITagInitUpdateAction }
  item?: { [key: string]: ITagPageAction | ITagInitUpdateAction }
}

export interface ITagInitUpdateAction {
  [ name: string ]: ITagPageAction
}

export interface ITag {
  name: string
  description?: string
  externalDocs?: IExternalDocs
  page?: ITagPage
}

// export interface IExample {}

export interface IHeader extends IBaseSchema {
  type: string
}

export interface IBaseParameter {
  name: string
  in: string
  required?: boolean
  description?: string
}

export interface IBodyParameter extends IBaseParameter {
  schema?: ISchema
}

export interface IQueryParameter extends IBaseParameter, IBaseSchema {
  type: string
  allowEmptyValue?: boolean
}

export interface IPathParameter extends IBaseParameter {
  type: string
  required: boolean
}

export interface IHeaderParameter extends IBaseParameter {
  type: string
}

export interface IFormDataParameter extends IBaseParameter, IBaseSchema {
  type: string
  collectionFormat?: string
}

export type Parameter =
  | IBodyParameter
  | IFormDataParameter
  | IQueryParameter
  | IPathParameter
  | IHeaderParameter;

export interface IPath {
  $ref?: string
  get?: IOperation
  put?: IOperation
  post?: IOperation
  delete?: IOperation
  options?: IOperation
  head?: IOperation
  patch?: IOperation
  parameters?: [Parameter]
}

export interface IOperation {
  requestBody: IRequestBody
  responses: { [responseName: string]: IResponse }
  summary?: string
  description?: string
  externalDocs?: IExternalDocs
  operationId?: string
  produces?: [string]
  consumes?: [string]
  parameters?: [Parameter]
  schemes?: [string]
  deprecated?: boolean
  security?: [Secuirty]
  tags?: [string]
  roles?: string[]
}
export interface IRequestBody {
  content: { [requestBodyType: string]: {schema:ISchema}}
  required: boolean
}

export interface IResponse {
  content:{ [contentType:string]:{schema:ISchema} }
  description: string
  schema?: ISchema
  headers?: { [headerName: string]: IHeader }
  examples?: { [exampleName: string]: {} }
}

export interface IBaseSchema {
  format?: string
  title?: string
  description?: string
  default?: string | boolean | number | Object
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxProperties?: number
  minProperties?: number
  enum?: [string | boolean | number | Object]
  type?: string
  items?: ISchema | [ISchema]
  field?: string
  page?: string
  hint?: string
}

export interface ISchema extends IBaseSchema {
  $ref?: string
  allOf?: [ISchema]
  oneOf?: [ISchema]
  additionalProperties?: boolean
  properties?: { [propertyName: string]: ISchema }
  discriminator?: IDiscriminator
  readOnly?: boolean
  writeOnly?: boolean
  xml?: IXML
  externalDocs?: IExternalDocs
  example?: { [exampleName: string]: {} }
  required?: string[]
}

export interface IDiscriminator {
  mapping: {[ refName: string]: string }
  propertyName: string
}

export interface IXML {
  type?: string
  namespace?: string
  prefix?: string
  attribute?: string
  wrapped?: boolean
}

export interface IBaseSecurity {
  type: string
  description?: string
}

export type IBasicAuthenticationSecurity = IBaseSecurity

export interface IApiKeySecurity extends IBaseSecurity {
  name: string
  in: string
}

export interface IBaseOAuthSecuirty extends IBaseSecurity {
  flow: string
}

export interface IOAuth2ImplicitSecurity extends IBaseOAuthSecuirty {
  authorizationUrl: string
}

export interface IOAuth2PasswordSecurity extends IBaseOAuthSecuirty {
  tokenUrl: string
  scopes?: [IOAuthScope]
}

export interface IOAuth2ApplicationSecurity extends IBaseOAuthSecuirty {
  tokenUrl: string
  scopes?: [IOAuthScope]
}

export interface IOAuth2AccessCodeSecurity extends IBaseOAuthSecuirty {
  tokenUrl: string
  authorizationUrl: string
  scopes?: [IOAuthScope]
}

export interface IOAuthScope {
  [scopeName: string]: string
}

export type Secuirty =
  | IBasicAuthenticationSecurity
  | IOAuth2AccessCodeSecurity
  | IOAuth2ApplicationSecurity
  | IOAuth2ImplicitSecurity
  | IOAuth2PasswordSecurity
  | IApiKeySecurity;

export interface ISpec {
  swagger: string
  info: Info
  externalDocs?: IExternalDocs
  host?: string
  basePath?: string
  schemes?: [string]
  consumes?: [string]
  produces?: [string]
  paths: { [pathName: string]: IPath }
  definitions?: { [definitionsName: string]: ISchema }
  components?: {
    schemas?: { [definitionsName: string]: ISchema }
    securitySchemes?: { [securityDefinitionName: string]: Secuirty }
  }
  parameters?: { [parameterName: string]: IBodyParameter | IQueryParameter }
  responses?: { [responseName: string]: IResponse }
  security?: [Secuirty]
  securityDefinitions?: { [securityDefinitionName: string]: Secuirty }
  tags?: [ITag]
}


export interface IOpenAPIRouter {
  name: string
  path: string
  icon: string
  page?: string
  children?: IOpenAPIRouter[]
}