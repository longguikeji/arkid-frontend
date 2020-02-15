import * as model from '@/models/oneid'
import * as api from '@/services/oneid'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import './AppList.less'

@Component({
  template: html`
  <div class="ui-applist-comp">
    <div class="ui-applist-comp--header">
      <span class="title">应用列表</span>
      <ButtonGroup size="small">
        <Button :type="visibility === 'all' ? 'primary' : 'default'" @click="visibility = 'all'">
          全部应用
        </Button>
        <Button :type="visibility === 'all' ? 'default' : 'primary'" @click="visibility = 'visible'">
          可访问应用
        </Button>
      </ButtonGroup>
    </div>
    <div class="ui-applist-comp--search">
      <Input
        v-model="keyword"
        search
        clearable
        placeholder="搜索应用"
        class="input"
      />
    </div>
    <div class="ui-applist-comp--results">
      <ul class="result-list">
        <li
          v-for="item in apps"
          @click="() => doClickApp(item)"
          :class="activeApp && item.uid === activeApp.uid ? 'active' : ''"
        >
          <Icon
            :type="item.access_result.value ? 'ios-eye' : 'ios-eye-off'"
            :color="item.access_result.value ? '#CDCDCD' : '#3E3E3E'"
            size="18"
          />
          <img :src="item.logo ? $fileUrl(item.logo) : defaultLogo" class="app-logo"/>
          <span class="app-name">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
  `,
})
export default class AppList extends Vue {
  @Prop({type: model.Node}) group?: model.Node
  @Prop({type: model.User}) user?: model.User

  visibility: 'all'|'visible' = 'all'
  keyword = ''
  apps: model.App[] = []
  activeApp: model.App|null = null
  defaultLogo: string = require('../../../../assets/icons/icon-applicationlist@2x.png')

  @Watch('keyword')
  onKeywordChange() {
    this.loadApps()
  }

  @Watch('visibility')
  onIsAllChange() {
    this.loadApps()
  }

  @Watch('activeApp')
  onActiveAppChange(app: model.App) {
    this.$emit('on-select', app)
  }

  async loadApps() {
    const {visibility, keyword} = this
    const {results: apps, count: total} = await api.App.list(await this.$app.org(),
     {
      pageSize: 100000,
      keyword,
      nodeId: this.group ? this.group.id : undefined,
      username: this.user ? this.user.username : undefined,
      ownerAccess: (visibility === 'visible') ? true : undefined,
    })
    this.apps = apps
  }

  doClickApp(app: model.App) {
    this.activeApp = app
  }

  async mounted() {
    await this.loadApps()
    this.activeApp = this.apps[0]
  }
}
