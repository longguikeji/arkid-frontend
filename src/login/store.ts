export default class LoginStore {
  public static readonly TOKEN = 'token'
  private static _token:string | null

  public static get token():string | null {
    if (LoginStore._token) {
      return LoginStore._token
    }
    LoginStore._token = window.localStorage.getItem(LoginStore.TOKEN)
    return LoginStore._token
  }

  public static set token(value:string | null) {
    if (value) {
      window.localStorage.setItem(LoginStore.TOKEN, value)
    } else {
      window.localStorage.removeItem(LoginStore.TOKEN)
    }
    LoginStore._token = value
  }

  public static ThirdUserID = ''
  public static BindUrl = ''
  public static NextUrl = ''
  public static TenantUUID: string | null
  public static Captcha: string | null
}