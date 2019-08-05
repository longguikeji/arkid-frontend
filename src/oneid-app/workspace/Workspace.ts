import {Vue, Component} from 'vue-property-decorator';

@Component({
  template: html`
  <Layout>
    <router-view></router-view>
  </Layout>
  `,
})
export default class Workspace extends Vue {}
