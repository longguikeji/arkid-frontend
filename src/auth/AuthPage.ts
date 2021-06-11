export default interface AuthPageTemplate {
  icon?: string
  title?: string
  info?: any
  btns?: Array<AuthBtn>
}

export interface AuthBtn {
  text?: string
  bgcolor?: string
  color?: string
  width?: number
  height?: number
}