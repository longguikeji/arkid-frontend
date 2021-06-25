import { ValidateModule } from '@/store/modules/validate'
import { GlobalValueModule } from '@/store/modules/global-value'

const getFileRegexp = (): RegExp => {
  const formats = GlobalValueModule.uploadFileFormat
  let formatStr = ''
  for (const format of formats) {
    formatStr += `\\.${format}|`
  }
  formatStr = formatStr.substring(0, formatStr.length - 1)
  formatStr = `/\\w(${formatStr})/i`
  return eval(formatStr)
}

const getFileHint = (): string => {
  let format = GlobalValueModule.uploadFileFormat.join(',')
  format = `请输入${format}格式的文件`
  return format
}

const RULE_REGEXP = {
  password: GlobalValueModule.passwordComplexity.regex,
  mobile: /(^(1)\d{10}$)/,
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: new RegExp(
    '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    'i',
    ),
  other: /[<>"'()&/ ]/gi,
  path: /^(?!.\/|..\/).*/
}

const RULE_HINT = {
  password: GlobalValueModule.passwordComplexity.hint,
  mobile: '请输入11位手机号码',
  username: '用户名不应包含' + "<>'()&/ " + '"',
  other: '输入内容不应包含' + "<>'()&/ " + '"等特殊字符',
  path: '路径不能以/或./或../开头'
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
  password: getRegexRule(RULE_HINT.password, RULE_REGEXP.password),
  mobile: getRegexRule(RULE_HINT.mobile, RULE_REGEXP.mobile),
  username: getRegexRule(RULE_HINT.username, RULE_REGEXP.other, true)
}

// 根据OpenAPI返回的结果进行规则生成，后续可能需要进一步地更新
const getDynamicRule = (name?: string, format?: string, hint?: string, required?: boolean) => {
  if (!format) format = 'other'
  if (name === 'data_path') {
    format = 'path'
    hint =RULE_HINT.path
  }
  let pattern: RegExp = new RegExp(''),
      isAnti: boolean = false
  switch (format) {
    case 'other':
      hint = RULE_HINT.other
      isAnti = true
      break
    case 'uri':
      format = 'url'
      break
    case 'icon':
      pattern = getFileRegexp()
      hint = getFileHint()
      break
  }
  const rule = { pattern: RULE_REGEXP[format] || pattern, message: hint, isAnti, required }
  return rule
}

// 输入框的内容校验
// 参数说明 =>
// value 当前值
// name 当前字段名称
// format OpenAPI描述的校验字段类型  uri email password mobile other
// hint 对应OpenAPI字段描述中的hint内容，文本提示
// required 是否为必填字段
export function validate(value: any, name: string, format?: string, hint?: string, required?: boolean): string {
  let { message, pattern, isAnti } = getDynamicRule(name, format, hint, required)
  if (value) {
    if (name === 'regular') {
      message = regexValidator(value)
    } else {
      const isValid = isAnti ? !pattern.test(value) : pattern.test(value)
      if (isValid) {
        message = ''
        ValidateModule.deleteInvalidItem(name)
      } else {
        message = message || '输入内容不正确'
        ValidateModule.addInvalidItem(name)
      }
    }
  } else {
    if (required) {
      message = `请输入${name}`
      ValidateModule.addInvalidItem(name)
    } else {
      message = ''
      ValidateModule.deleteInvalidItem(name)
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

function regexValidator(val: any): string {
  let message: string = ''
  if (val && !(eval(`/${val}/`) instanceof RegExp)) {
    message = '正则表达式格式错误'
    ValidateModule.addInvalidItem('regular')
  } else {
    ValidateModule.deleteInvalidItem('regular')
  }
  return message
}
