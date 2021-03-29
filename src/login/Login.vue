<template>
  <login-component
    title="北京龙归科技有限公司"
    icon="https://www.longguikeji.com/img/icons/favicon-32x32.png"
    :config="config"
  />
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import LoginComponent from './components/LoginComponent.vue'
import { LoginPagesConfig, LoginPageConfig } from './interface'
import LoginStore from './store/login'

@Component({
  name: 'Login',
  components: {
    LoginComponent
  }
})
export default class Login extends Vue {
  get config():LoginPagesConfig {
    LoginStore.TenantUUID = this.$route.query.tenant
    let host = ''
    if (LoginStore.TenantUUID) {
      host = LoginStore.host + '/api/v1/tenant/' + LoginStore.TenantUUID
    } else {
      host = LoginStore.host + '/api/v1'
    }
    let extendLogin:Object|undefined
    if (!LoginStore.ThirdUserID && !LoginStore.BindUrl) {
      extendLogin = {
        title: '第三方登录',
        buttons: [
          {
            img: 'https://github.githubassets.com/favicons/favicon.png',
            tooltip: 'Github',
            redirect: {
              url: host + '/github/login',
              params: {
                next: 'http://' + window.location.host + '/third_part_callback'
              }
            }
          },
          {
            img: 'https://gitee.com/assets/favicon.ico',
            tooltip: 'Gitee',
            redirect: {
              url: host + '/gitee/login',
              params: {
                next: 'http://' + window.location.host + '/third_part_callback'
              }
            }
          }
        ]
      }
    }

    const loginPage:LoginPageConfig = {
      forms: [
        {
          label: '密码登录',
          items: [
            {
              type: 'text',
              placeholder: '请输入账号，手机号',
              name: 'username'
            },
            {
              type: 'password',
              placeholder: '请输入密码',
              name: 'password'
            }
          ],
          submit: {
            label: '登录',
            http: {
              url: host + '/login/',
              method: 'post',
              params: {
                username: 'username',
                password: 'password'
              }
            }
          }
        },
        {
          label: '验证码登录',
          items: [
            {
              type: 'text',
              placeholder: '请输入手机号',
              name: 'mobile'
            },
            {
              type: 'text',
              placeholder: '请输入验证码',
              name: 'code',
              append: {
                label: '发送验证码',
                delay: 60,
                http: {
                  url: host + '/send_sms/',
                  method: 'post',
                  params: {
                    mobile: 'mobile'
                  }
                }
              }
            }
          ],
          submit: {
            label: '登录',
            http: {
              url: host + '/mobile_login/',
              method: 'post',
              params: {
                mobile: 'mobile',
                code: 'code'
              }
            }
          }
        }
      ],
      bottoms: [
        {
          prepend: '还没有账号，',
          label: '立即注册',
          gopage: 'register'
        },
        {
          label: '忘记密码?'
        }
      ],
      extend: extendLogin
    }
    const registerPage:LoginPageConfig = {
      forms: [
        {
          label: '用户名注册',
          items: [
            {
              type: 'text',
              placeholder: '用户名',
              name: 'username'
            },
            {
              type: 'password',
              placeholder: '密码',
              name: 'password'
            },
            {
              type: 'password',
              placeholder: '重新填写密码',
              name: 'password'
            }
          ],
          submit: {
            label: '注册'
            // http: {
            //   url: ''
            // }
          }
        },
        {
          label: '手机号注册',
          items: [
            {
              type: 'text',
              placeholder: '请输入手机号',
              name: 'mobile'
            },
            {
              type: 'password',
              placeholder: '密码',
              name: 'password'
            },
            {
              type: 'password',
              placeholder: '重新填写密码',
              name: 'password'
            },
            {
              type: 'text',
              placeholder: '请输入验证码',
              name: 'code',
              append: {
                label: '发送验证码',
                delay: 60,
                http: {
                  url: host + '/send_sms/',
                  method: 'post',
                  params: {
                    mobile: 'mobile'
                  }
                }
              }
            }
          ],
          submit: {
            label: '注册'
          }
        }
      ],
      bottoms: [
        {
          prepend: '已有账号，',
          label: '立即登录',
          gopage: 'login'
        }
      ]
    }
    return {
      login: loginPage,
      register: registerPage
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
