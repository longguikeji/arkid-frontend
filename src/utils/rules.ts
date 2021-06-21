import { ValidateModule } from '@/store/modules/validate'

const RULE_REGEXP = {
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{8,}$/, // 之后需要进行动态的读取
  mobile: /(^(1)\d{10}$)|(^(\+\d{1,3}) \d{4,12}$)/,
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: new RegExp(
    '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    'i',
    ),
  other: /[<>"'()&/ ]/gi
}

const getRegexRule = (message: string, regex: RegExp, isAnti?: boolean) => {
  return {
    trigger: 'blur', validator: (rule: any, value: string, callback: Function) => {
      const isValid = isAnti ? (!regex.test(value) || !value) : (regex.test(value) || !value)
      if (isValid) {
        callback()
      } else {
        callback(new Error(message))
      }
    }
  }
}

// 主要用于登录、注册、password组件等Form表单的统一校验
export const RULES = {
  required: { required: true, message: '必填项', trigger: 'blur' },
  password: getRegexRule('密码长度大于等于8位的字母数字组合', RULE_REGEXP.password),
  mobile: getRegexRule('手机号码格式有误', RULE_REGEXP.mobile),
  username: getRegexRule('用户名不包含' + "<>'()&/" + '"', RULE_REGEXP.other, true)
}

// 输入框的内容校验
// 参数说明 =>
// value 当前值
// name 当前字段名称
// format OpenAPI描述的校验字段类型  uri email password mobile other
// hint 对应OpenAPI字段描述中的hint内容，文本提示
// required 是否为必填字段
export function validate(value: any, name: string, format?: string, hint?: string, required?: boolean): string {
  if (!format) format = 'other'
  if (format === 'uri') format = 'url'
  let message: string = ''
  if (!value) {
    if (required) {
      message = `请输入${name}`
      ValidateModule.addInvalidItem(name)
    }
  } else {
    const isValid = format === 'other' ? !RULE_REGEXP[format].test(value) : RULE_REGEXP[format].test(value)
    if (isValid) {
      ValidateModule.deleteInvalidItem(name)
    } else {
      message = hint || ''
      ValidateModule.addInvalidItem(name)
    }
  }
  return message
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
