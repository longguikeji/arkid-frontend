import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import './Config.less'
import ContactsSwitch from './ContactsSwitch'
import FileStorage from './FileStorage'
import LoginConfig from './LoginConfig'

@Component({
  components: {
    LoginConfig,
    FileStorage,
    ContactsSwitch,
  },
  template: html`
  <div class="ui-config">
    <Menu class="side-menu" activeName="login" @on-select="changePage">
      <MenuItem v-for="(item, index) in pages" :key="index" :name="item.name">
        <XIcon :name="item.icon" md></XIcon>
        <span>{{ item.description }}</span>
      </MenuItem>
    </Menu>
    <div class="ui-config--content">
      <div class="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem :to="{name: 'admin.config'}">配置管理</BreadcrumbItem>
          <BreadcrumbItem>{{ description }}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <LoginConfig v-if="pageName === 'login'"/>
      <FileStorage v-if="pageName === 'file'"/>
      <ContactsSwitch v-if="pageName === 'contacts'"/>
    </div>
  </div>
  `,
})
export default class Config extends Vue {
  pageName: string = 'login'

  pages = [
    {
      name: 'login',
      icon: 'admin-config',
      description: '登录页面',
    },
    {
      name: 'file',
      icon: 'file-storage',
      description: '文件存储',
    },
    {
      name: 'contacts',
      icon: 'allaccount',
      description: '通讯录开关',
    },
  ]

  get description() {
    const page = this.pages.find(p => p.name === this.pageName)
    return page!.description
  }

  changePage(name: string) {
    this.pageName = name
  }
}
