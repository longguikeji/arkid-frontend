import AsyncValidator from 'async-validator'

export const RULES = {
  required: { required: true, message: '必填项', trigger: 'blur' },
  password: getRule('password', '', true)
}

export const RULE_REGEXP = {
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{8,}$/,
  mobile: /(^(1)\d{10}$)|(^(\+\d{1,3}) \d{4,12}$)/,
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: new RegExp(
    '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    'i',
    ),
  other: /[<>"'()&/ ]/gi
}

// 获取所使用到的一些规则
export function getRule(field: string, message: string, required?: boolean) {
  let rule 
  switch (field) {
    case 'password':
      rule = { type: 'string', trigger: 'blur', required, validator: (rule, value, callback) => {
        if (RULE_REGEXP.password.test(value)) {
          callback()
        } else {
          callback(new Error(message || '密码长度大于等于8位的字母数字组合'))
        }
      }}
      break
    case 'email':
      rule = { type: 'email', message, required }
      break
    case 'uri':
    case 'url':
      rule = { type: 'url', message, required }
      break
    case 'mobile':
      rule = { type: 'string', message, required, pattern: RULE_REGEXP.mobile }
    default:
      rule = { required, message: '请重新输入', validator: (rule, value) => { return !RULE_REGEXP.other.test(value) } }
  }
  return rule
}

// 校验 el-input 中输入的内容
export function formateValidator(value: any, field?: string, message?: string, required?: boolean) {
  if (!field) field = 'other'
  if (!message) message = ''
  const rule = getRule(field, message, required)
  const descriptor = { [field]: { ...rule } }
  return new Promise(function(resolve, reject) {
    const validator = new AsyncValidator(descriptor)
    validator.validate({ [field!]: value }, { firstFields: true }, (errors) => {
      resolve(errors)
    })
  })
}

// 输入框的内容校验
// 参数说明 =>
// value 当前值
// format OpenAPI描述的校验字段类型  uri email password mobile other
export function validate(value: any, format?: string, message?: string, required?: boolean) {
  if (!format) format = 'other'
  if (!message) message = ''
}

// 校验csv, excel等导入的文件内容
export function xlsxValidator(header: any[], body: any[]): boolean {
  let xlsxIsValid = true
  for (let i = 0,len = header.length; i < len; i++) {
    if (RULE_REGEXP.other.test(header[i])) {
      xlsxIsValid = false
      break
    }
  }
  if (xlsxIsValid) {
    for (let i = 0,len = body.length; i < len; i++) {
      if (RULE_REGEXP.other.test(body[i])) {
        xlsxIsValid = false
        break
      }
    }
  }
  return xlsxIsValid
}
