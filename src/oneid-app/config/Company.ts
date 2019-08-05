import {Vue, Component, Prop} from 'vue-property-decorator';
import {sideMenu} from './menu';
import * as configApi from '@/services/config';
import * as oneidApi from '@/services/oneid';
import {Config} from '@/models/config';
// import {Form} from 'iview';
import './index.less';

type Form = any;

@Component({
  template: html`
  <div class="lg-noah-config-company-page flex-col flex-auto" style="height: 0">
    <Form
      v-if="form"
      :model="form"
      :rules="rules"
      class="form"
      ref="form"
      labelPosition="left"
    >
      <FormItem prop="name" label="昵称设置:">
        <Input type="text" v-model="form.org.nameCn" placeholder="请设置昵称" class="name-input"></Input>
      </FormItem>
      <FormItem prop="logo" label="企业LOGO上传:">
        <div class="logo flex-row">
          <div class="img-block flex-col">
            <div class="img-wrapper">
              <img
                v-if="form.org.icon"
                ref="logo"
                :src="formatImgSource(form.org.icon)"
                @error="$refs.logo.style.display = 'none';"
              />
            </div>
            <Upload
              name="file"
              v-bind="upload"
              :on-success="onUploadSuccess"
              :show-upload-list="false"
              class="upload"
            ><a href="javascript: void(0)">点击上传</a></Upload>
          </div>
          <span class="tips">
            建议图片长宽比例为1:1，大小不超过1M 保证头像在圆形范围内清晰可见
          </span>
        </div>
      </FormItem>
      <div class="btn-block flex-row">
        <Button type="primary" @click="doSave" :loading="isSaving" class="btn">保存</Button>
      </div>
    </Form>
  </div>
  `,
})
export default class Company extends Vue {
  $refs!: {
    form: Form,
  };
  form: Config|null = null;

  get viewMeta() {
    return {
      breadcrumb: ['设置', '企业设置'],
      sideMenu: {
        menus: sideMenu.menus,
      },
    };
  }

  get upload() {
    return {
      headers: oneidApi.File.headers(),
      action: oneidApi.File.baseUrl(),
    };
  }

  get rules() {
    return {
      org: {
        nameCn: {required: true, message: '必填项', trigger: 'blur'},
      },
    };
  }

  mounted() {
    this.loadData();
  }

  async loadData() {
    this.form = await configApi.Config.retrieve();
  }

  onUploadSuccess(resp: {file_name: string}) {
    this.form!.org.icon = resp.file_name;
  }

  async doSave() {
    const isValid = await this.$refs.form.validate();
    if (!isValid) {
      return;
    }
    this.$Loading.start();
    try {
      await configApi.Config.partialUpdate(this.form!);
      this.$Loading.finish();
      await configApi.Config.refreshMeta();
      this.$app.loadBaseInfo();
    } catch (e) {
      console.log(e);
      this.$Loading.error();
    }
  }

  formatImgSource(key: string) {
    return oneidApi.File.url(key);
  }
}
