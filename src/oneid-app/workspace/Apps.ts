import {Vue, Component, Prop} from 'vue-property-decorator';
import {UCenter as UCenterApi} from '@/services/oneid';
import {App} from '@/models/oneid';

type IApp = {
  uuid: string;
  url: string;
  route: string;
  logo: string;
  name: string;
  description: string;
};


@Component({

  template: html`
<div class="ws-apps--app-box-wrap">
  <div class="ws-apps--app-box flex-col">
    <div class="ws-apps--app-box-header flex-row">
      <Input search clearable v-model="keyword" placeholder="搜索应用" style="width: 260px;" />
    </div>
    <div class="ws-apps--app-box-main">
      <ul v-if="fApps && fApps.length" class="card-list flex-row">
        <li
          v-for="item in fApps"
          :key="item.uuid"
          class="flex-row" @click="goToApp(item)">
          <div class="logo">
            <img :src="item.logo ? $fileUrl(item.logo) : defaultLogo" />
          </div>
          <div class="name-intro flex-col flex-auto">
            <span class="name">{{ item.name }}</span>
            <span class="intro">{{ formatLongString(item.remark, 16) }}</span>
          </div>
        </li>
      </ul>

      <div v-else-if="!loading">无应用</div>
    </div>
  </div>
</div>
  `,
})
export default class Apps extends Vue {

  keyword = '';
  defaultLogo: string = require('../../assets/icons/icon-applicationlist@2x.png');
  apps: App[] = [];
  loading = true;
  // IApp[] = Array.from(Array(40)).map((x, i) => ({
  //   uuid: String(i),
  //   url: '',
  //   route: '',
  //   logo: '',
  //   name: `应用名称 ${i}`,
  //   description: '应用的简单描述，不超过一行',
  // }));

  get fApps(): App[] {
    const {apps, keyword} = this;
    const kw = keyword.toLocaleLowerCase();
    return keyword ? apps.filter(item => item.name.toLocaleLowerCase().includes(kw))
      : apps;
  }

  async created() {
    const {results: appList} = await UCenterApi.apps();
    const apps = appList.filter(x => x.uid !== 'oneid').map((app: any) => App.fromData(app));

    // console.log('apps', apps);
    // console.log(apps, count);

    this.apps = apps;
    this.loading = false;
  }

  goToApp(app: App) {
    const {oauth_app: {home_url}} = app;

    if (home_url) {
      window.open(home_url, '_blank');
    } else {
      this.$Modal.error({content: `${app.name}没有配置跳转链接！`});
    }
  }

  formatLongString(str: string, max: number) {
    if (!str) {
      return '';
    }
    return str.length < max ? str : `${str.slice(0, max)}...`;
  }

}
