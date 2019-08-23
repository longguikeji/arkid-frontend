import {Vue, Component, Watch} from 'vue-property-decorator';
import * as api from '@/services/config';
import * as model from '@/models/config';
import './ThirdParty.less';

@Component({
  template: html`
  <div class="ui-account-thirdparty-page">
    <div class="ui-account-thirdparty-page-wrapper">
      <div class="ui-account-thirdparty-page-subtitle">
        <h5>选择账号同步平台</h5>
        <span class="help">（当前只允许激活一个账号同步平台）</span>
      </div>
      <div class="ui-account-thirdparty-page-content">
        <div class="third-party-list-wrapper">
          <ul class="third-party-list">
            <li v-for="item in data"
              :key="item.name"
              :class="item.name === activeName ? 'active' : ''"
              @click="activeName = item.name"
            >
              <span>
                <Icon :type="item.icon" color="#006064" size="22" class="icon"></Icon>
                <span class="name">{{ item.name }}账号</span>
                <!-- <span :class="'status status-' + item.status"></span> -->
              </span>
              <!-- <span class="action action-activate" v-if="item.status === 'no'">激活</span>
              <span class="action action-deactivate" v-else>取消激活</span> -->
            </li>
          </ul>
        </div>
        <div class="form-wrapper" v-if="form && fields">
          <Form :model="form" class="form">
            <FormItem v-for="item in fields"
              :key="item.key"
              :prop="item.key"
              :label="item.label"
              :labelWidth="158"
            >
              <Input v-model="form[item.key]"/>
            </FormItem>
          </Form>
          <div class="btns">
            <Button type="primary" @click="doSave" :loading="isSaveLoading" class="submit-btn">保存配置</Button>
            <Button type="primary" @click="doImport" :loading="isImporting" class="submit-btn">开始同步</Button>
          </div>
        </div>
        <div class="no-data" v-else>
          <XIcon name="account-synchronization" class="no-data-icon"/>
          <span class="no-data-info">账号同步</span>
          <span class="no-data-help">账号同步可以让您与主流企业管理平台进行信息同步，减少操作成本，从而提升效率</span>
        </div>
      </div>
    </div>
  </div>
  `,
})
export default class ThirdParty extends Vue {
  config: model.Config|null = null;

  activeName: string|null = null;
  data: {
    icon: string;
    name: string;
    status: 'no'|'ok';
  }[] = [
    {icon: 'logo-github', name: '钉钉', status: 'no'},
  ];

  form: any|null = null;
  fields: {key: string, label: string}[]|null = null;
  isSaveLoading = false;

  taskId: string = '';
  interval: any|null = null;
  isImporting = false;

  @Watch('activeName')
  onActiveNameChange(val: string) {
    if (val) {
      this.initForm();
    }
    this.form = null;
  }

  async loadConfig() {
    this.config = await api.Config.retrieve();
  }

  initForm() {
    if (this.activeName! === '钉钉') {
      const fields = [
        {key: 'appKey', label: 'appKey'},
        {key: 'appSecret', label: 'appSecret'},
        {key: 'corpId', label: 'corpId'},
        {key: 'corpSecret', label: 'corpSecret'},
      ];
      const {ding} = this.config as model.Config;
      const form = {
        appKey: ding.appKey,
        appSecret: ding.appSecret,
        corpId: ding.corpId,
        corpSecret: ding.corpSecret,
      };

      this.$nextTick(() => {
        this.fields = fields;
        this.form = form;
      });
    }
  }

  async doSave() {
    const {config} = this;
    config!.ding.appKey = this.form.appKey;
    config!.ding.appSecret = this.form.appSecret;
    config!.ding.corpId = this.form.corpId;
    config!.ding.corpSecret = this.form.corpSecret;

    this.$Loading.start();
    try {
      await api.Config.partialUpdate(config);
      this.$Loading.finish();
    } catch (e) {
      console.log(e)
      this.$Loading.error();
    }
  }

  async doImport() {
    this.$Loading.start();
    try {
      const {task_id: taskId} = await api.Config.importDing();
      this.taskId = taskId;
      this.pollImportResult();

      this.$Loading.finish();
    } catch (e) {
      this.$Loading.error();
    }
  }

  pollImportResult() {
    this.isImporting = true;
    this.interval = setInterval(this.importResult, 2000);
  }

  async importResult() {
    try {
      const {status} = await api.Config.importResult(this.taskId);
      this.onImportResult(status);
    } catch (e) {
      console.log('polling');
    }
  }

  onImportResult(status: number) {
    if (status === 1 || status === 2) {
      return;
    }

    clearInterval(this.interval);
    this.interval = null;
    this.isImporting = false;

    if (status === 3) {
      this.$Message.error('同步失败');
    }
    if (status === 4) {
      this.$Message.success('同步成功');
    }
  }

  mounted() {
    this.loadConfig();
  }
}
