import LoginStore from "../store/login"

export const getRegexRule = (message: string, regex: RegExp, isAnti?: boolean) => {
  return {
    trigger: "blur",
    validator: (rule: any, value: string, callback: Function) => {
      const isValid = isAnti
        ? !regex.test(value) || !value
        : regex.test(value) || !value
      if (isValid) {
        callback()
      } else {
        callback(new Error(message))
      }
    }
  }
}

// 默认的密码复杂度，当在总域名下进行注册时，默认使用该表达式，其他情况使用租户指定的密码复杂度
const DEFAULT_PASSWORD_COMPLEXITY = {
  regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{8,}$/,
  hint: "密码长度大于等于8位，且为数字和字母的组合"
}

const DYNAMIC_PASSWORD_COMPLEXITY = {
  regex: LoginStore.passwordComplexity.regex || new RegExp(""),
  hint: LoginStore.passwordComplexity.hint || ""
}

export const RULES = {
  required: { required: true, message: "必填项", trigger: "blur" },
  password: LoginStore.TenantUUID
    ? getRegexRule(
        DYNAMIC_PASSWORD_COMPLEXITY.hint,
        DYNAMIC_PASSWORD_COMPLEXITY.regex
      )
    : getRegexRule(DEFAULT_PASSWORD_COMPLEXITY.hint, DEFAULT_PASSWORD_COMPLEXITY.regex),
  mobile: getRegexRule('请输入11位手机号码', /(^(1)\d{10}$)/),
  username: getRegexRule('用户名不应包含' + "<>'()&/ " + '"', /[<>"'()&/ ]/gi, true)
}
