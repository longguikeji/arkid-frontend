export const getRegexRule = (
  message: string,
  regex: RegExp,
  isAnti?: boolean
) => {
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

// 默认的密码复杂度，当在总域名下进行注册时，默认使用该表达式，其他情况使用租户指定的密码复杂度，与后端接口保持一致
export const DEFAULT_PASSWORD_RULE = {
  regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~$@$!%*#?&])[A-Za-z\d~$@$!%*#?&]{6,18}$/,
  hint: "6-18位字母、数字、特殊字符组合"
}

export const RULES = {
  required: { required: true, message: "必填项", trigger: "blur" },
  mobile: getRegexRule("请输入11位手机号码", /(^(1)\d{10}$)/),
  username: getRegexRule("用户名不应包含" + "<>'()&/ " + '"', /[<>"'()&/ ]/gi, true),
  email: getRegexRule("请输入正确的邮箱", /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)
}
