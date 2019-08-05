import {Vue, Component, Prop} from 'vue-property-decorator';
import {sideMenu} from './menu';

@Component({
  template: html`
  <div class="lg-noah-locale-page flex-row flex-auto">
    <div class="lg-noah-locale-page--time-zone">
      <div class="header">
        <span class="title">时区设置</span>
        <span class="subtitle">当前工作时间：{{ now }}</span>
      </div>
      <Form :labelWidth="80" class="form" :labelWidth="110">
        <FormItem prop="timeZone" label="当前时区：">
          <Input type="text" v-model="timeZone" placeholder="请填写当前时区"></Input>
        </FormItem>
        <Button type="primary" class="submit-btn">保存</Button>
      </Form>
    </div>
    <div class="lg-noah-locale-page--region">
      <div class="header">
        <span class="title">企业地区设置</span>
      </div>
      <Form :labelWidth="80" class="form" :labelWidth="110">
        <FormItem prop="region" label="企业地区：">
          <Input type="text" v-model="region" placeholder="请填写企业地区"></Input>
        </FormItem>
        <Button type="primary" class="submit-btn">保存</Button>
      </Form>
    </div>
    <div class="lg-noah-locale-page--language">
      <div class="header">
        <span class="title">企业语言设置</span>
      </div>
      <Form :labelWidth="80" class="form" :labelWidth="110">
        <FormItem prop="language" label="企业语言：">
          <Input type="text" v-model="language" placeholder="请填写企业语言"></Input>
        </FormItem>
        <Button type="primary" class="submit-btn">保存</Button>
      </Form>
    </div>
  </div>
  `,
})
export default class Locale extends Vue {
  get viewMeta() {
    return {
      breadcrumb: [
        {label: '设置', path: {name: 'oneid.config'}},
        '地区与时区',
      ],
      sideMenu: {
        menus: sideMenu.menus,
      },
    };
  }

  now: Date|null = null;
  // TODO (kaishun): remove any
  timeZone: any = '';
  region: any = '';
  languge: any = '';
}
