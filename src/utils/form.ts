import FormItemState from '@/admin/common/Form/FormItem/FormItemState'
import FormObjectItemState from '@/admin/common/Form/FormObjectItem/FormObjectItemState'
import FormState from '@/admin/common/Form/FormState'
import OptionType from '@/admin/common/Form/Select/OptionType'
import SelectState from '@/admin/common/Form/Select/SelectState'
import { FormPage } from '@/admin/FormPage/FormPageState'
import OpenAPI, { ISchema } from '@/config/openapi'
// import { isEmpty } from 'lodash'

export default function generateForm(schema: ISchema, showReadOnly: boolean = false, showWriteOnly: boolean = true, disabled: boolean = false, readonly: boolean = false) {
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
    formState.items = getItemsBySchema(schema, showReadOnly, showWriteOnly, disabled, '', readonly)
  }
  return formPageState
}

function getItemsBySchema(schema:ISchema, showReadOnly:boolean, showWriteOnly: boolean, disabled: boolean, skipProp = '', readonly: boolean = false) {
  const tempItems:{[prop:string]:FormItemState} = {}
  const { required, properties } = schema
  if (properties) {
    for (const prop in properties) {
      if (prop === skipProp) {
        continue
      }
      const propSchema = properties[prop]
      const isRequired = required ? required.includes(prop) : false
      const item = createItemByPropSchema(prop, propSchema, showReadOnly, showWriteOnly, disabled, isRequired, readonly)
      if (item) tempItems[prop] = item
    }
  }
  return tempItems
}

function createItemByPropSchema(prop:string, schema: ISchema, showReadOnly:boolean, showWriteOnly: boolean, disabled: boolean, required: boolean, readonly: boolean = false) {
  if (!showReadOnly && schema.readOnly) return null
  if (!showWriteOnly && schema.writeOnly) return null
  let item: FormItemState | null = null
  if (schema.format === 'date-time') {
    item = createDateTimeItem(prop, schema)
  } else if (schema.format === 'download_url') {
    item = createLinkItem(prop, schema, readonly)
  } else if (schema.page && schema.type !== 'object') {
    item = createInputListItem(prop, schema, disabled, required)
  } else if (schema.type === 'array') {
    item = createArrayItem(prop, schema, showReadOnly, showWriteOnly, disabled, required)
  } else if (schema.enum) {
    item = createEnumItem(prop, schema, disabled, required)
  } else if (schema.type === 'integer') {
    item = createInputNumberItem(prop, schema, disabled, required, readonly)
  } else if (schema.type === 'string') {
    item = createInputItem(prop, schema, disabled, required, readonly)
  } else if (schema.type === 'boolean') {
    item = createBooleanItem(prop, schema, disabled, required, readonly)
  } else if (schema.type === 'object') {
    item = createObjectItem(prop, schema, showReadOnly, showWriteOnly, disabled)
  } else if (schema.allOf?.length || schema.oneOf?.length) { 
    item = createCombineItem(prop, schema, showReadOnly, showWriteOnly, disabled, required)
  }
  return item
}

function createDateTimeItem(prop: string, schema: ISchema, readonly: boolean = false) {
  if (readonly) {
    return {
      label: schema.title,
      value: schema.default
    }
  } else {
    return {
      type: 'DatePicker',
      label: schema.title,
      prop,
      state: {
        value: '',
        placeholder: `请输入${schema.title}`,
      }
    }
  }
}

function createLinkItem(prop: string, schema: ISchema, readonly: boolean = false) {
  if (readonly) {
    return {
      label: schema.title,
      value: schema.default
    }
  } else {
    return {
      type: 'Link',
      label: schema.title,
      prop: prop,
      state: {
        value: schema.default
      }
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
      value: schema.type === 'array' ? [] : '',
      default: schema.default,
      required: required,
      disabled: disabled && !schema.readOnly,
      options: [],
      action: 'initInputList',
      page: schema.page,
      field: schema.field,
      link: schema.link
    }
  }
}

function createArrayItem(prop: string, schema: ISchema, showReadOnly: boolean, showWriteOnly: boolean, disabled: boolean, required: boolean) {
  let item: FormItemState | null = null
  const ref = schema.items && (schema.items as ISchema)?.$ref
  if (ref) {
    const arraySchema = OpenAPI.instance.getSchemaByRef(ref)
    item = createItemByPropSchema(prop, arraySchema, showReadOnly, showWriteOnly, disabled, required)
    item!.label = schema.title
    item!.state.multiple = true
    item!.state.url = schema.url
    item!.state.prop = prop
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
        disabled: disabled && !schema.readOnly,
        url: schema.url,
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

function createInputNumberItem(prop: string, schema: ISchema, disabled: boolean, required: boolean, readonly: boolean = false) {
  if (readonly) return { label: schema.title, value: schema.default }
  return {
    type: 'InputNumber',
    label: schema.title,
    prop: prop,
    state: {
      value: schema.default,
      default: schema.default,
      readonly: schema.readOnly || readonly,
      required: required,
      disabled: disabled && !schema.readOnly
    }
  }
}

function createInputItem(prop: string, schema: ISchema, disabled: boolean, required: boolean, readonly: boolean = false) {
  if (readonly) return { label: schema.title, value: schema.default }
  return {
    type: schema.format === 'html' ? 'Rich' : 'Input',
    label: schema.title,
    prop: prop,
    state: {
      value: schema.default,
      default: schema.default,
      readonly: schema.readOnly || readonly,
      placeholder: '请输入' + schema.title,
      required: required,
      showPassword: prop.includes('password'),
      autocomplete: 'new-password',
      format: schema.format,
      hint: schema.hint,
      disabled: disabled,
      name: prop,
      type: prop === 'icon' || prop === 'logo' || schema.format === 'upload_file' ? 'link' : undefined,
      pattern: schema.pattern
    }
  }
}

function createBooleanItem(prop: string, schema: ISchema, disabled: boolean, required: boolean, readonly: boolean = false) {
  if (readonly) return { label: schema.title, value: schema.default }
  return {
    type: 'SwitchForm',
    label: schema.title,
    prop: prop,
    state: {
      value: schema.default || false,
      disabled: disabled && !schema.readOnly,
      default: schema.default || false,
      required: required,
      readonly: readonly
    }
  }
}

function createObjectItem(prop: string, schema: ISchema, showReadOnly: boolean, showWriteOnly: boolean, disabled: boolean) {
  const itemState = new FormObjectItemState()
  if (schema.init) {
    itemState.items = {}
    Object.assign(itemState, { init: schema.init })
  } else {
    itemState.items = getItemsBySchema(schema, showReadOnly, showWriteOnly, disabled)
    Object.assign(itemState, { isAddItem: schema.format === 'custom_dict' })
  }
  // if (isEmpty(itemState.items)) return null
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
