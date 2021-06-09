import FormItemState from '@/admin/common/Form/FormItem/FormItemState'
import FormObjectItemState from '@/admin/common/Form/FormObjectItem/FormObjectItemState'
import FormState from '@/admin/common/Form/FormState'
import OptionType from '@/admin/common/Form/Select/OptionType'
import SelectState from '@/admin/common/Form/Select/SelectState'
import { FormPage } from '@/admin/FormPage/FormPageState'
import OpenAPI, { ISchema } from '@/config/openapi'

export default function generateForm(schema:ISchema, showReadOnly = true): FormPage {
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
        items: getItemsBySchema(refSchema, showReadOnly, propertyName)
      }
    }
  } else {
    const formState:FormState = {}
    formPageState.form = formState
    formState.items = getItemsBySchema(schema, showReadOnly, '')
  }
  return formPageState
}

function getItemsBySchema(schema:ISchema, showReadOnly:boolean, skipProp = '', showWriteOnly: boolean = true) {
  const tempItems:{[prop:string]:FormItemState} = {}
  const requiredSchema = schema.required
  for (const prop in schema.properties) {
    if (prop === skipProp) {
      continue
    }
    const propSchema = schema.properties[prop]
    const isRequired = requiredSchema ? requiredSchema.includes(prop) : false
    const item = createItemByPropSchema(prop, propSchema, showReadOnly, showWriteOnly, isRequired)
    if (item) tempItems[prop] = item
  }
  return tempItems
}

function createItemByPropSchema(prop:string, schema: ISchema, showReadOnly:boolean, showWriteOnly: boolean, isRequired?: boolean):FormItemState | null {
  let item: FormItemState | null = null
  if (!showReadOnly && schema.readOnly) return item
  if (!showWriteOnly && schema.writeOnly) return item
  if (schema.page) {
    item = {
      type: 'InputList',
      label: schema.title,
      prop: prop,
      state: {
        multiple: schema.type === 'array',
        value: schema.default,
        default: schema.default,
        required: isRequired,
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
  } else if (schema.type === 'array') {
    item = {
      type: 'Select',
      label: schema.title,
      prop: prop,
      state: {
        multiple: true,
        value: schema.default,
        default: schema.default,
        options: [],
        required: isRequired
      }
    }
  } else if (schema.enum) {
    const options:Array<OptionType> = []
    for (const value of schema.enum) {
      options.push({ value: value })
    }
    const selectState: SelectState = {
      options: options,
      value: schema.default,
      default: schema.default,
      readonly: schema.readOnly,
      required: isRequired
    }
    item = {
      type: 'Select',
      label: schema.title,
      prop: prop,
      state: selectState
    }
  } else if (schema.type === 'integer') {
    item = {
      type: 'InputNumber',
      label: schema.title,
      prop: prop,
      state: {
        value: schema.default,
        default: schema.default,
        readonly: schema.readOnly,
        required: isRequired
      }
    }
  } else if (schema.type === 'string') {
    item = {
      type: 'Input',
      label: schema.title,
      prop: prop,
      state: {
        value: schema.default,
        default: schema.default,
        readonly: schema.readOnly,
        placeholder: '请输入' + schema.title,
        required: isRequired,
        showPassword: prop === 'password',
        autocomplete: 'new-password'
      }
    }
    if (schema.format === 'uri' && location.pathname === '/tenant') {
      item.type = 'InputLink'
    }
  } else if (schema.type === 'boolean') {
    item = {
      type: 'SwitchForm',
      label: schema.title,
      prop: prop,
      state: {
        value: schema.default || false
      }
    }
  } else if (schema.type === 'boolean') {
    item = {
      type: 'SwitchForm',
      label: schema.title,
      prop: prop,
      state: {
        value: schema.default || false
      }
    }
  } else if (schema.type === 'object') {
    const itemState = new FormObjectItemState()
    itemState.items = getItemsBySchema(schema, showReadOnly)
    item = {
      type: 'FormObjectItem',
      label: schema.title,
      prop: prop,
      state: itemState
    }
  } else if (schema.allOf?.length || schema.oneOf?.length) {
    const ref = schema.allOf?.length ? schema.allOf[0].$ref : schema.oneOf![0].$ref
    const objectSchema = OpenAPI.instance.getSchemaByRef(ref!)
    objectSchema.title = schema.title
    objectSchema.default = schema.default
    item = createItemByPropSchema(prop, objectSchema, showReadOnly, showWriteOnly)
  }
  return item
}
