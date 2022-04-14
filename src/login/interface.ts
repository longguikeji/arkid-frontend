export interface LoginPagesConfig {
  [key:string]:LoginPageConfig
}

export interface LoginPageConfig {
  name?: string
  forms?:Array<FormConfig>
  bottoms?:Array<ButtonConfig>
  extend?:LoginExtendConfig
}

export interface LoginExtendConfig {
  title?: string
  buttons?: Array<ButtonConfig>
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
  value?:string
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
  copyright_text?: string
  background_url?: string
  password_complexity?: {
    regular: string
    title: string
  }
}
