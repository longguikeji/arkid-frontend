import AsyncValidator from 'async-validator'

interface FormatRule {
  prop: string
  hint: string
  format: string | RegExp
  value?: any
  required?: boolean
}

export const RULES = {
  required: { required: true, message: '必填项', trigger: 'blur' },
  password: getRegexRule('密码长度大于等于8位的字母数字组合', /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{8,}$/),
}

export function getRegexRule(message: string, regex: RegExp) {
  return {
    trigger: 'blur', validator: (rule: any, value: string, callback: Function) => {
      if (regex.test(value) || !value) {
        callback()
      } else {
        callback(new Error(message))
      }
    }
  }
}

export function getFormatRule(prop: string, format: string | RegExp, message: string, required: boolean = false) {
  if (format === 'uri') format = 'url'
  const rule = { type: format, message: message, required: required }
  if (format === 'password') {
    rule['pattern'] = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{8,}$/
    rule.type = 'string'
  }
  if (prop === 'mobile' || format === 'mobile') {
    rule.type = 'string'
    rule['pattern'] = /(^(1)\d{10}$)|(^(\+\d{1,3}) \d{4,12}$)/  
  }
  return rule
}

export function validateFormat(info: FormatRule) {
  const { format, hint, value, required, prop } = info
  const rule = getFormatRule(prop, format, hint, required)
  const descriptor = { [prop!]: {} }
  descriptor[prop!] = Object.assign({}, rule)
  const formatValidator = new Promise(function (resolve, reject) {
    const validator = new AsyncValidator(descriptor)
    validator.validate({ [prop]: value }, { firstFields: true }, (errors) => {
      resolve(errors)
    })
  })
  return formatValidator
}
