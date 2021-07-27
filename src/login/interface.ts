export interface LoginPagesConfig {
  [key:string]:LoginPageConfig
}

export interface LoginPageConfig {
  name?: string
  forms?:Array<FormConfig>
  bottoms?:Array<ButtonConfig>
  extend?:{
    title?: string
    buttons?: Array<ButtonConfig>
  }
}

export interface FormConfig {
  label?:string
  items?:Array<FormItemConfig>
  submit?:ButtonConfig
}

export interface FormItemConfig {
  type?:string
  placeholder?:string
  name?:string
  append?:ButtonConfig
}

export interface ButtonConfig {
  prepend?:string
  label?:string
  tooltip?:string
  long?:boolean
  img?:string
  gopage?:string
  redirect? :{
    url?:string
    params?:any // key: fromItem.name
  }
  http?:{
    url:string
    method:string
    params?: any // key: fromItem.name
  }
  delay?:Number
  agreement?: {
    title?: string
    content?: string
  }
}

export interface LoginTenant {
  uuid?: string
  name?: string
  slug?: string
  icon?: string
  created?: string
  password_complexity?: TenantPasswordComplexity
}

export interface TenantPasswordComplexity {
  regular?: string
  title?: string
}

export interface PasswordComplexity {
  regex?: RegExp
  hint?: string
}
