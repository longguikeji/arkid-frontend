import {Vue, Component, Prop} from 'vue-property-decorator';
import {pick} from 'lodash';
import * as model from '@/models/oneid';
import {UCenter as UCenterApi, File as FileApi, getUser, ApiService} from '@/services/oneid';
import './Userinfo.less';

import VerifyPassword from './VerifyPassword';
import ResetMobile from './ResetMobile';
import {ResetEmail} from './ResetEmail';


@Component({
  components: {
    ResetMobile,
  },
  template: html`
<div>
<Drawer
  :value="show"
  placement="right"
  :closable="false"
  :maskClosable="false"
  :width="580"
  className="ui-edit-user"
>
  <div class="title">编辑资料</div>
  <Form
    :model="form"
    :rules="rules"
    labelPosition="right"
    :labelWidth="100"
    ref="form"
    class="form"
  >
    <FormItem prop="avatar" label="头像">
      <UserAva :user="form" size="xxl" class="avatar"/>
      <div>
        <p class="avatar-help">
          建议图片长宽比例为1:1，大小不超过1M 保证头像在圆形范围内清晰可见
        </p>
        <div class="flex-row">
          <Upload name="file"
            v-bind="upload"
            :on-success="onUploadSuccess"
            :show-upload-list="false"
            class="upload"
          >
            <Button>点击上传</Button>
          </Upload>
          <a class="use-default-avatar" @click="clearAvatar">使用默认头像</a>
        </div>
      </div>
    </FormItem>

    <FormItem prop="name" label="姓名">
      <Input type="text" v-model="form.name" placeholder="请输入 姓名"></Input>
    </FormItem>
    <FormItem prop="mobile" label="手机">
      <div class="mobile">
        <span>{{ form.mobile || '-'}}</span>
        <Button @click="doEditMobile">{{ form.mobile ? '修改' : '添加' }}</Button>
      </div>
    </FormItem>
    <FormItem prop="email" label="邮箱">
      <div class="email">
        <span>{{ form.email || '-'}}</span>
        <Button @click="doEditEmail">{{ form.email ? '修改' : '添加' }}</Button>
      </div>
    </FormItem>
  </Form>

  <div class="drawer-footer flex-row flex-auto">
    <Button type="default" :disabled="isSaving" @click="doCancel">取消</Button>
    <div class="flex-row flex-auto"></div>
    <Button type="primary" @click="doSave" :loading="isSaving">保存</Button>
  </div>
</Drawer>
<ResetMobile
  v-if="showResetMobile"
  :user="user"
  :password="password"
  @on-hide="showResetMobile = false"
/>
</div>
  `,
})
class EditInfo extends Vue {
  @Prop() user!: any;

  form = {
    username: this.user.username,
    avatar: this.user.avatar,
    name: this.user.name,
    mobile: this.user.mobile,
    email: this.user.private_email,
  };
  rules = {};
  show = true;  // 辅助 <Drawer />
  isSaving = false;

  editField: 'mobile'|'email'|null = null;
  password = '';

  showResetMobile = false;

  get upload() {
    return {
      headers: FileApi.headers(),
      action: FileApi.baseUrl(),
    };
  }

  onUploadSuccess(resp: {file_name: string}) {
    this.form.avatar = resp.file_name;
  }

  doCancel() {
    this.show = false;
    this.$emit('done');
  }

  async doSave() {
    this.isSaving = true;

    const data = await UCenterApi.partialUpdate(this.form as any);

    this.isSaving = false;

    this.show = false;
    this.$emit('done', pick(data, ['name', 'mobile', 'email', 'avatar']));
  }

  clearAvatar() {
    this.form.avatar = '';
  }

  doEditMobile() {
    this.editField = 'mobile';
    this.doComfirmPassword();
  }

  doEditEmail() {
    this.editField = 'email';
    this.doComfirmPassword();
  }

  doComfirmPassword() {
    this.password = '';
    this.$Modal.confirm({
      width: 800,
      render: (h?: Vue.CreateElement) => {
        return h!(VerifyPassword, {on: {
          input: (val: string) => this.password = val,
        }});
      },
      onOk: this.doVerifyPassword,
    });
  }

  async doVerifyPassword() {
    try {
      const {token} = await UCenterApi.verifyPassword(this.user.username, this.password);
      if (this.editField === 'mobile') {
        this.doSendSms();
      } else {
        this.$nextTick(() => {
          setTimeout(this.doSendEmail, 500);
        });
      }
    } catch(e) {
      console.log(e)
      if (e.status === 400 && e.data.non_field_errors) {
        this.$Message.error('密码错误');
        return;
      }
      this.$Message.error('验证失败');
    }
  }

  doSendSms() {
    this.showResetMobile = true;
  }

  doSendEmail() {
    const {password} = this;
    this.$Modal.confirm({
      width: 800,
      render: (h?: Vue.CreateElement) => {
        return h!(ResetEmail, {props: {password}});
      },
    });
  }
}

@Component({
  components: {
    EditInfo,
  },

  template: html`
<div class="ui-workspace-userinfo-page-wrap">
  <div v-if="user" class="ui-workspace-userinfo-page">
    <div class="ui-workspace-userinfo--logo"><UserAva :user="user" size="xxl" /></div>
    <div class="ui-workspace-userinfo--main">
      <div class="ui-workspace-userinfo--summary">
        <Button @click="doShowEdit" style="float: right">编辑资料</Button>
        <h4>{{ user.name || user.username }}</h4>
      </div>

      <UserInfoList :user="user" :orgUser="orgUser"/>

    </div>
  </div>

  <EditInfo
    v-if="showEdit"
    :user="user"
    @done="onEditDone"
    />

</div>
  `,

})
export default class UserMy extends Vue {
  showEdit = false;
  orgUser = {};

  get user() {
    return this.$app.user;
  }

  async created() {
    this.orgUser = await UCenterApi.getCurrentOrgUser(this.$app.user.username)
  }

  doShowEdit() {
    this.showEdit = true;
  }

  onEditDone(data: any) {
    if (data) {
      Object.assign(this.user, data);
    }

    this.showEdit = false;
  }

}
