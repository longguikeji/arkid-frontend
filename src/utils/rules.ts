import { ValidateModule } from '@/store/modules/validate'
import { GlobalValueModule } from '@/store/modules/global-value'
import { getRegexRule } from '@/login/utils/rules'

const getUploadFileRegular = () => {
  const formats = GlobalValueModule.uploadFileFormat
  const hint = `请输入${formats.join(',')}格式的文件`
  let formatStr = ''
  for (const format of formats) {
    formatStr += `\\.${format}|`
  }
  formatStr = formatStr.substring(0, formatStr.length - 1)
  return {
    pattern: new RegExp(formatStr, 'i'),
    hint: hint
  }
}

const RULE_REGEXP = {
  mobile: /(^(1)\d{10}$)/,
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: new RegExp(
    '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    'i',
    ),
  other: /[<>"'()&/ ]/gi, // <>"'()&/ 可以增加字符的控制，目前包含 小括号 尖括号 单引号 双引号 &符 /斜线符 空格
  path: /^(?!.\/|..\/).*/
}

const RULE_HINT = {
  mobile: '请输入11位手机号码',
  other: '输入内容不应包含' + "<>'()&/ " + '"等特殊字符',
  path: '路径不能以/或./或../开头'
}

export function getPasswordRule() {
  const { regex, hint } = GlobalValueModule.passwordComplexity
  return getRegexRule(hint || '', regex || new RegExp(''))
}

// 根据OpenAPI返回的结果进行规则生成，后续可能需要进一步地更新
const getDynamicRule = (name?: string, format?: string, hint?: string, required?: boolean) => {
  // if (!format) format = 'other' // 先注释掉检查工具，以便arkid-backend调试使用
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
      const regular = getUploadFileRegular()
      pattern = regular.pattern
      hint = regular.hint
      break
  }
  const rule = { pattern: format ? RULE_REGEXP[format] : pattern, message: hint, isAnti, required }
  return rule
}

// 输入框的内容校验
// 参数说明 =>
// value 当前值
// name 当前字段名称
// format OpenAPI描述的校验字段类型  uri email password mobile other
// hint 对应OpenAPI字段描述中的hint内容，文本提示
// required 是否为必填字段
export function validate(value: any, name: string, format?: string, hint?: string, required?: boolean, p?: string): string {
  let { message, pattern, isAnti } = getDynamicRule(name, format, hint, required)
  if (p) pattern = new RegExp(p)
  if (value && pattern) {
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
