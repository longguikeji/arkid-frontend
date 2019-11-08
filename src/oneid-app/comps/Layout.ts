import * as api from '@/services/oneid'
import {FORM_RULES} from '@/utils'
import {Form} from 'iview/types/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import './Layout.less'

@Component({
  template: html`
  <div class="lg-layout">
    <header class="lg-layout--header">
      <div class="header-left">
        <router-link :to="{name: 'home'}">
          <SiteLogo class="site-logo" />
        </router-link>
      </div>
      <div class="header-middle">
        <Menu mode="horizontal" :activeName="topMenuActiveName" v-if="topMenu && topMenuActiveName">
          <MenuItem v-for="item in topMenu" :name="item.name" :to="{name: item.name}">
            {{ item.title }}
          </MenuItem>
        </Menu>
      </div>
      <div class="header-right">
        <RouterLink :to="{name: 'admin.account'}" v-if="isWorkspacePage && $app.user.hasAccessToAdmin">
          <Button class="workspace-btn">管理后台</Button>
        </RouterLink>
        <RouterLink :to="{name: 'home'}" v-else-if="isAdminPage">
          <Button class="workspace-btn">返回工作台</Button>
        </RouterLink>

        <UserAva class="avatar" :user="$app.user" />
        <Dropdown @on-click="dropDownClick" style="cursor: pointer;" placement="bottom-end">
          <span class="username">{{ username }}</span>
          <Icon type="md-arrow-dropdown" size="22" color="#666666"></Icon>
          <DropdownMenu slot="list">
            <DropdownItem name="logout">退出登录</DropdownItem>
            <DropdownItem name="changePassword">修改密码</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <template v-if="isAdminPage">
          <Divider type="vertical" class="divider"></Divider>
          <a href="https://oneid1.docs.apiary.io/#" target="_blank">
          <div class="help">
            <XIcon name="document" size="13"></XIcon>
            <span>文档与帮助</span>
          </div>
          </a>
        </template>
      </div>
    </header>
    <div class="lg-layout--body">
      <div class="lg-layout--side" v-if="sideMenu && sideMenuActiveName">
        <Menu mode="vertical" :activeName="sideMenuActiveName" class="side-menu">
          <MenuItem v-for="item in sideMenu" :name="item.name" :to="{name: item.name}">
            <XIcon :name="item.icon" md></XIcon>
            <span>{{ item.title }}</span>
          </MenuItem>
        </Menu>
      </div>
      <div class="lg-layout--main">
        <div class="lg-layout--main-wrapper">
          <div v-if="breadcrumb" class="breadcrumb">
            <Breadcrumb>
              <BreadcrumbItem
                v-for="item in breadcrumb"
                :to="item.name ? {name: item.name} : undefined"
              >
                {{ item.title || item }}
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <slot></slot>
        </div>
      </div>
    </div>
    <Modal
      v-model="showChangePassword"
      width="800"
      height="560"
    >
      <div slot="header">
        <span class="lg-layout--change-password-header">修改密码</span>
      </div>
      <div class="flex-row">
        <div class="lg-layout--change-password-form">
          <Form
            :label-width="220"
            :model="changePasswordForm"
            :rules="changePasswordFormRules"
            ref="changePasswordForm"
          >
            <FormItem prop="oldPassword" label="验证原密码">
              <Input type="password" v-model="changePasswordForm.oldPassword" placeholder="输入原密码"></Input>
            </FormItem>
            <div class="lg-layout--new-password">
              <FormItem prop="newPassword" label="输入新密码">
                <Input type="password" v-model="changePasswordForm.newPassword" placeholder="输入新密码"></Input>
              </FormItem>
              <FormItem prop="passwordAgain" label="再次输入新密码">
                <Input type="password" v-model="changePasswordForm.passwordAgain" placeholder="再次输入新密码"></Input>
              </FormItem>
            </div>
          </Form>
        </div>
        <div
          class="lg-layout--password-check flex-col">
          <Icon class="lg-layout--password-check"
            v-if="isValidPassword === true"
            type="ios-checkmark-circle" color="#52C41A" size="18"
          />
          <Icon class="lg-layout--password-check"
            v-if="isValidPassword === false"
            type="ios-close-circle" color="#F5222D" size="18"
          />
        </div>
      </div>
      <div slot="footer" class="lg-layout--change-password-footer flex-row">
        <div class="buttons flex-row">
          <a href="javascript: void(0)" @click="goToResetPassword">忘记密码？去重置</a>
          <div>
            <Button class="right-button" type="default" @click="doCancel">取消</Button>
            <Button class="right-button" type="primary" @click="doSave">确定</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
  `,
})
export default class Layout extends Vue {
  showChangePassword: boolean = false
  $refs!: {
    changePasswordForm: Form,
  }
  isValidPassword: boolean|null = null

  changePasswordForm = {
    oldPassword: '',
    newPassword: '',
    passwordAgain: '',
  }

  @Watch('changePasswordForm.oldPassword')
  onOldPasswordChange(val: string) {
    this.verifyPassword(val)
  }

  async verifyPassword(password: string) {
    try {
      await api.UCenter.verifyPassword(this.$app.user!.username, password)
      this.isValidPassword = true
    }
    catch (e) {
      this.isValidPassword = false
    }
  }

  get siteName() {
    return this.$app.metaInfo!.org.nameCn
  }

  get username() {
    return this.$app.user!.name
  }

  get changePasswordFormRules() {
    const passwordDiffCheck = {
      trigger: 'blur',
      // tslint:disable-next-line:no-any
      validator: (rule: any, value: string, cb: any) => {
        if (this.changePasswordForm.newPassword !== this.changePasswordForm.passwordAgain) {
          cb(new Error('两次输入的密码不一致'))
        }
        else {
          cb()
        }
      },
    }
    return {
      oldPassword: [FORM_RULES.required],
      newPassword: [
        FORM_RULES.required,
        FORM_RULES.password,
      ],
      passwordAgain: [
        FORM_RULES.required,
        FORM_RULES.password,
        passwordDiffCheck,
      ],
    }
  }

  get topMenu() {
    const adminMenu = [
      {title: '账号管理', name: 'admin.account'},
      {title: '分组管理', name: 'admin.group'},
      {title: '应用管理', name: 'admin.app'},
      {title: '配置管理', name: 'admin.config'},
      {title: '子管理员', name: 'admin.manager'},
      {title: '操作日志', name: 'admin.oplog'},
    ]
    const wsMenu = this.$app.user && this.$app.user.is_extern_user ? [
      {title: '我的应用', name: 'workspace.apps'},
      {title: '个人资料', name: 'workspace.userinfo'},
    ] : [
      {title: '我的应用', name: 'workspace.apps'},
      {title: '通讯录', name: 'workspace.contacts'},
      {title: '个人资料', name: 'workspace.userinfo'},
    ]
    return this.isAdminPage ? adminMenu
      : this.isWorkspacePage ? wsMenu
      : []
  }

  get topMenuActiveName() {
    const menu = this.topMenu.find(i => this.$route.name!.startsWith(i.name))
    if(menu) {
      return menu.name
    } else {
      return ''
    }
  }

  get sideMenu() {
    const {name} = this.$route
    if (name) {
      if (name.startsWith('admin.account')) {
        return [
          {title: '所有账号', icon: 'allaccount', name: 'admin.account'},
          {title: '账号配置', icon: 'accountsettings', name: 'admin.account.settings'},
          {title: '账号同步', icon: 'synchronous', name: 'admin.account.thirdparty'},
        ]
      }
    }
    return null
  }

  get sideMenuActiveName() {
    if (this.$route.name === 'admin.account.perm') {
      return 'admin.account'
    }
    return this.sideMenu
      ? this.sideMenu.find(i => this.$route.name === i.name)!.name
      : ''
  }

  get breadcrumb() {
    const name = this.$route.name!
    const map = new Map([
      ['admin.account', [
        {title: '账号管理', name: 'admin.account'},
        '所有账号',
      ]],
      ['admin.account.perm', [
        {title: '账号管理', name: 'admin.account'},
        {title: '所有账号', name: 'admin.account'},
        '账号权限管理',
      ]],
      ['admin.account.settings', [
        {title: '账号管理', name: 'admin.account'},
        '账号配置',
      ]],
      ['admin.account.thirdparty', [
        {title: '账号管理', name: 'admin.account'},
        '账号同步',
      ]],
      // 分组权限管理的面包屑位置特殊，由页面自行管理
      ['admin.app.perm', [
        {title: '应用管理', name: 'admin.app'},
        '权限管理',
      ]],
    ])
    return map.get(name)
  }

  get sideMenuActiveTitle() {
    if (this.$route.name === 'admin.account.perm') {
      return '应用内权限'
    }
    return this.sideMenu
      ? this.sideMenu.find(i => this.$route.name === i.name)!.title
      : ''
  }

  get isWorkspacePage() {
    return (this.$route.name || '').startsWith('workspace')
  }

  get isAdminPage() {
    return (this.$route.name || '').startsWith('admin')
  }

  dropDownClick(menuName: string) {
    if (menuName === 'logout') {
      this.$app.logout()
    }
    else {
      this.showChangePassword = true
      this.$refs.changePasswordForm.resetFields()
    }
  }

  doCancel() {
    this.showChangePassword = false
  }

  async doSave() {
    if (!this.isValidPassword) {
      this.$Message.error('原密码错误，请重新输入')
      return
    }

    // tslint:disable: await-promise
    const isValid = await this.$refs.changePasswordForm.validate()
    if (!isValid) {
      return
    }

    try {
      await api.UCenter.resetPasswordWithOldPassword(
        this.$app.user.username,
        this.changePasswordForm.oldPassword,
        this.changePasswordForm.newPassword)
      this.$Message.success('修改密码成功')
      this.showChangePassword = false
    } catch (e) {
      this.$Message.error('修改密码失败')
    }
  }

  async goToResetPassword() {
    this.showChangePassword = false
    await api.logout()
    this.$router.push({name: 'oneid.password'})
  }
}
