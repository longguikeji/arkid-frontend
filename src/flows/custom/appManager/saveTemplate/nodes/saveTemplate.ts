import { APINode } from '@/arkfbp/nodes/apiNode'

interface AuthTemplate {
  icon?: string
  title?: string
  info?: string
  agree?: AuthButton
  cancel?: AuthButton
}

interface AuthButton {
  text?: string
  tcolor?: string
  bcolor?: string
  width?: number
  height?: number
}

export class SaveTemplate extends APINode {

  private style: string = ''

  private template: AuthTemplate = {}

  async run() {
    const { template, ...args } = this.inputs.params
    this.template = args
    const html = template !== 'no' ? this.getTemplateHtml() : args.html
    this.url = this.inputs.url
    this.method = 'POST'
    this.params = {
      html: html
    }
    await super.run()
  }

  getTemplateHtml() {
    const template = document.createElement('html')
    const head = document.createElement('head')
    head.innerHTML = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>应用授权</title>'
    const body = document.createElement('body')
    const auth = this.initAuthPage()
    body.appendChild(auth)
    const style = document.createElement('style')
    style.innerHTML = this.style
    head.appendChild(style)
    template.appendChild(head)
    template.appendChild(body)
    const page = '<html lang="en">' + template.innerHTML + '</html>'
    return page
  }

  initAuthPage() {
    const auth = this.createAuthElement('div', ['auth'], '.auth{width: 500px;height: auto;position: absolute;top: 30%;left: 50%;transform: translateX(-50%) translateY(-50%);background-color: #fff;padding: 15px;box-shadow: 0 2px 16px #D3CECE, 0 0 1px #D3CECE, 0 0 1px #D3CECE;}')
    const header = this.initAuthPageHeader()
    const info = this.initAuthPageInfo()
    const footer = this.initAuthPageBtns()
    auth.appendChild(header)
    auth.appendChild(info)
    auth.appendChild(footer)
    return auth
  }

  initAuthPageHeader() {
    const header = this.createAuthElement('div', ['header'], '.header{text-align: center;}')
    if (this.template.icon) {
      const icon = this.createAuthElement('img', ['icon'], '.icon{width: 60px;}')
      icon.setAttribute('src', this.template.icon)
      header.appendChild(icon)
    }
    if (this.template.title) {
      const title = this.createAuthElement('div', ['title'], '.title{font-size: 20px;font-weight: bold;}')
      title.innerHTML = this.template.title
      header.appendChild(title)
    }
    return header
  }

  initAuthPageInfo() {
    const info = this.createAuthElement('div', ['info'], '')
    info.innerHTML = this.template.info || ''
    return info
  }

  initAuthPageBtns() {
    const footer = this.createAuthElement('form', ['footer'], '.footer{margin-top: 20px;}')
    footer.setAttribute('method', 'post')
    const crsf = this.createAuthElement('span', ['crsf'], '.crsf{display: none}')
    crsf.innerHTML = '{%  csrf_token %}'
    footer.appendChild(crsf)
    const agreeBtn = this.createAuthElement('input', ['btn', 'agree'], `.btn{width: ${this.template.agree?.width || 360}px;height: ${this.template.agree?.height || 36}px;display: block;margin-bottom: 10px;position: relative;left: 50%;transform: translateX(-50%);border: 0px;cursor: pointer;}.agree{background-color: ${this.template.agree?.bcolor || 'rgb(177, 31, 31)'};color: ${this.template.agree?.tcolor || 'white'};}`)
    agreeBtn.setAttribute('value', this.template.agree?.text || '授 权')
    agreeBtn.setAttribute('type', 'submit')
    agreeBtn.setAttribute('name', 'allow')
    const cancelBtn = this.createAuthElement('input', ['btn', 'cancel'], `.cancel{background-color: ${this.template.cancel?.bcolor || ''};color: ${this.template.cancel?.tcolor || ''};}`)
    cancelBtn.setAttribute('value', this.template.cancel?.text || '取 消')
    cancelBtn.setAttribute('type', 'submit')
    footer.appendChild(agreeBtn)
    footer.appendChild(cancelBtn)
    return footer
  }

  createAuthElement(type: string, classNames: Array<string>, style: string) {
    const el = document.createElement(type)
    el.className = classNames.join(' ')
    this.style = this.style + style
    return el
  }

}
