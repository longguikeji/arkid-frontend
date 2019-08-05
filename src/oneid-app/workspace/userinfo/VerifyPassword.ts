import {Vue, Component, Prop} from 'vue-property-decorator';

@Component({
  template: html`
  <div class="ui-workspace-userinfo-verify-password">
    <span class="title">修改个人邮箱/手机号需要验证密码</span>
    <Form
      :model="form"
      labelPosition="right"
      :labelWidth="120"
      class="form">
      <FormItem prop="password" label="输入登录密码">
        <Input
          type="password"
          v-model="form.password"
          placeholder="输入密码"
          @input="val => $emit('input', val)"
          class="input"
        />
      </FormItem>
    </Form>
  </div>
  `,
})
export default class VerifyPassword extends Vue {
  form = {
    password: '',
  };
}
