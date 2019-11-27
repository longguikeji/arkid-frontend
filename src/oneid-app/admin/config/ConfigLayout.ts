import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Config from './Config'
import './ConfigLayout.less'
import FileStorage from './FileStorage'

@Component({
  components: {
    Config,
    FileStorage,
  },
  template: html`
  <div class="ui-config">
    <Menu class="side-menu" activeName="admin" @on-select="changePage">
      <MenuItem name="admin">
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
          <BreadcrumbItem>{{isAdmin ? '登录页面' : '文件存储'}}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Config v-if="isAdmin"/>
      <FileStorage v-else/>
    </div>
  </div>
  `,
})
export default class ConfigLayout extends Vue {
  isAdmin: boolean = true

  changePage(name: string) {
    this.isAdmin = name === 'admin'
      ? true : false
  }
}
