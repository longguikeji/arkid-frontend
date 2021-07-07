import FormItemState from '@/admin/common/Form/FormItem/FormItemState'
import FormObjectItemState from '@/admin/common/Form/FormObjectItem/FormObjectItemState'
import FormState from '@/admin/common/Form/FormState'
import OptionType from '@/admin/common/Form/Select/OptionType'
import SelectState from '@/admin/common/Form/Select/SelectState'
import { FormPage } from '@/admin/FormPage/FormPageState'
import OpenAPI, { ISchema } from '@/config/openapi'

export default function generateForm(schema: ISchema, showReadOnly: boolean = true, showWriteOnly: boolean = true, disabled: boolean = false): FormPage {
  const formPageState: FormPage = {}  
  if (schema.discriminator && schema.oneOf) {
    const propertyName = schema.discriminator.propertyName
    const selectState:SelectState = {
      value: '',
      options: [],
      valueKey: propertyName
    }
    const refForms = {}
    formPageState.select = selectState
    formPageState.forms = refForms
    for (const refValue in schema.discriminator.mapping) {
      if (selectState.value === '') {
        selectState.value = refValue
      }
      selectState.options?.push({
        value: refValue
      })
      const refSchema = OpenAPI.instance.getSchemaByRef(schema.discriminator.mapping[refValue])
      if (refSchema.properties![propertyName]) formPageState.title = refSchema.properties![propertyName].title
      refForms[refValue] = {
        items: getItemsBySchema(refSchema, showReadOnly, showWriteOnly, disabled, propertyName)
      }
    }
  } else {
    const formState:FormState = {}
    formPageState.form = formState
    formState.items = getItemsBySchema(schema, showReadOnly, showWriteOnly, disabled, '')
  }
  return formPageState
}

function getItemsBySchema(schema:ISchema, showReadOnly:boolean, showWriteOnly: boolean, disabled: boolean, skipProp = '', ) {
  const tempItems:{[prop:string]:FormItemState} = {}
  const requiredSchema = schema.required
  for (const prop in schema.properties) {
    if (prop === skipProp) {
      continue
    }
    const propSchema = schema.properties[prop]
    const required = requiredSchema ? requiredSchema.includes(prop) : false
    const item = createItemByPropSchema(prop, propSchema, showReadOnly, showWriteOnly, disabled, required)
    if (item) tempItems[prop] = item
  }
  return tempItems
}

function createItemByPropSchema(prop:string, schema: ISchema, showReadOnly:boolean, showWriteOnly: boolean, disabled: boolean, required: boolean):FormItemState | null {
  let item: FormItemState | null = null
  if (!showReadOnly && schema.readOnly) return item
  if (!showWriteOnly && schema.writeOnly) return item
  if (schema.format === 'download_url') {
    item = createLinkItem(prop, schema)
  } else if (schema.page) {
    item = createInputListItem(prop, schema, disabled, required)
  } else if (schema.type === 'array') {
    item = createArrayItem(prop, schema, showReadOnly, showWriteOnly, disabled, required)
  } else if (schema.enum) {
    item = createEnumItem(prop, schema, disabled, required)
  } else if (schema.type === 'integer') {
    item = createInputNumberItem(prop, schema, disabled, required)
  } else if (schema.type === 'string') {
    item = createInputItem(prop, schema, disabled, required)
  } else if (schema.type === 'boolean') {
    item = createBooleanItem(prop, schema, disabled, required)
  } else if (schema.type === 'object') {
    item = createObjectItem(prop, schema, showReadOnly, showWriteOnly, disabled)
  } else if (schema.allOf?.length || schema.oneOf?.length) { 
    item = createCombineItem(prop, schema, showReadOnly, showWriteOnly, disabled, required)
  }
  return item
}

function createLinkItem(prop: string, schema: ISchema) {
  return {
    type: 'Link',
    label: schema.title,
    prop: prop,
    state: {
      value: schema.default,
      displayContent: 'link'
    }
  }
}

function createInputListItem(prop: string, schema: ISchema, disabled: boolean, required: boolean) {
  return {
    type: 'InputList',
    label: schema.title,
    prop: prop,
    state: {
      multiple: schema.type === 'array',
      value: schema.default,
      default: schema.default,
      required: required,
      disabled: disabled && !schema.readOnly,
      options: [],
      action: 'initInputList',
      data: {
        page: schema.page,
        field: schema.field,
        title: schema.title,
        multi: schema.type === 'array',
      }
    }
  }
}

function createArrayItem(prop: string, schema: ISchema, showReadOnly: boolean, showWriteOnly: boolean, disabled: boolean, required: boolean) {
  let item: FormItemState | null = null
  if (schema.items) {
    const ref = (schema.items as ISchema)?.$ref
    if (ref) {
      const arraySchema = OpenAPI.instance.getSchemaByRef(ref)
      item = createItemByPropSchema(prop, arraySchema, showReadOnly, showWriteOnly, disabled, required)
      item!.label = schema.title
      item!.state.multiple = true
    }
  } else {
    item = {
      type: 'Select',
      label: schema.title,
      prop: prop,
      state: {
        multiple: true,
        value: schema.default,
        default: schema.default,
        options: [],
        required: required,
        disabled: disabled && !schema.readOnly
      }
    }
  }
  return item
}

function createEnumItem(prop: string, schema: ISchema, disabled: boolean, required: boolean) {
  const options:Array<OptionType> = []
  for (const value of schema.enum!) {
    options.push({ value: value })
  }
  const selectState: SelectState = {
    options: options,
    value: schema.default,
    default: schema.default,
    readonly: schema.readOnly,
    required: required,
    disabled: disabled && !schema.readOnly
  }
  return {
    type: 'Select',
    label: schema.title,
    prop: prop,
    state: selectState
  }
}

function createInputNumberItem(prop: string, schema: ISchema, disabled: boolean, required: boolean) {
  return {
    type: 'InputNumber',
    label: schema.title,
    prop: prop,
    state: {
      value: schema.default,
      default: schema.default,
      readonly: schema.readOnly,
      required: required,
      disabled: disabled && !schema.readOnly
    }
  }
}

function createInputItem(prop: string, schema: ISchema, disabled: boolean, required: boolean) {
  return {
    type: 'Input',
    label: schema.title,
    prop: prop,
    state: {
      value: schema.default,
      default: schema.default,
      readonly: schema.readOnly,
      placeholder: '请输入' + schema.title,
      required: required,
      showPassword: prop.includes('password') || prop.includes('email') || prop.includes('mobile'),
      autocomplete: 'new-password',
      format: prop === 'icon' ? 'icon' : schema.format,
      hint: schema.hint,
      disabled: disabled,
      name: prop,
      type: prop === 'icon' ? 'link' : undefined
    }
  }
}

function createBooleanItem(prop: string, schema: ISchema, disabled: boolean, required: boolean) {
  return {
    type: 'SwitchForm',
    label: schema.title,
    prop: prop,
    state: {
      value: schema.default || false,
      disabled: disabled && !schema.readOnly,
      default: schema.default || false,
      required: required,
    }
  }
}

function createObjectItem(prop: string, schema: ISchema, showReadOnly: boolean, showWriteOnly: boolean, disabled: boolean) {
  const itemState = new FormObjectItemState()
  itemState.items = getItemsBySchema(schema, showReadOnly, showWriteOnly, disabled)
  return {
    type: 'FormObjectItem',
    label: schema.title,
    prop: prop,
    state: itemState
  }
}

function createCombineItem(prop: string, schema: ISchema, showReadOnly: boolean, showWriteOnly: boolean, disabled: boolean, required: boolean) {
  const ref = schema.allOf?.length ? schema.allOf[0].$ref : schema.oneOf![0].$ref
  const objectSchema = OpenAPI.instance.getSchemaByRef(ref!)
  objectSchema.title = schema.title
  objectSchema.default = schema.default
  return createItemByPropSchema(prop, objectSchema, showReadOnly, showWriteOnly, disabled, required)
}
