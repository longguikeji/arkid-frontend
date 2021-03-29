export default class LoginStore {
  public static readonly TOKEN = 'token'

  private static _token:string

  public static get token():string {
    if (LoginStore._token && LoginStore._token !== '') {
      return LoginStore._token
    }
    const token = window.localStorage.getItem(LoginStore.TOKEN)
    if (token != null) { LoginStore._token = token }
    return LoginStore._token
  }

  public static set token(value:string) {
    window.localStorage.setItem(LoginStore.TOKEN, value)
    LoginStore._token = value
  }

  public static ThirdUserID = ''
  public static BindUrl = ''
  public static NextUrl = ''

  public static host = 'http://127.0.0.1:8000'
  public static TenantUUID:string | (string | null)[]
}
