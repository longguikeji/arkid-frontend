import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import './Config.less'
import FileStorage from './FileStorage'
import LoginConfig from './LoginConfig'

@Component({
  components: {
    LoginConfig,
    FileStorage,
  },
  template: html`
  <div class="ui-config">
    <Menu class="side-menu" activeName="login" @on-select="changePage">
      <MenuItem name="login">
        <XIcon name="admin-config" md></XIcon>
        <span>登录页面</span>
      </MenuItem>
      <MenuItem name="file">
        <XIcon name="file-storage" md></XIcon>
        <span>文件存储</span>
      </MenuItem>
    </Menu>
    <div class="ui-config--content">
      <div class="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem :to="{name: 'admin.config'}">配置管理</BreadcrumbItem>
          <BreadcrumbItem>{{pageName === 'login' ? '登录页面' : '文件存储'}}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <LoginConfig v-if="pageName === 'login'"/>
      <FileStorage v-if="pageName === 'file'"/>
    </div>
  </div>
  `,
})
export default class Config extends Vue {
  pageName: string = 'login'

  changePage(name: string) {
    this.pageName = name
  }
}
