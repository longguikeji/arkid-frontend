export const RULES = {
  required: { required: true, message: '必填项', trigger: 'blur' },
  password: getRegexRule('密码长度大于等于8位的字母数字组合', /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{8,}$/)
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


