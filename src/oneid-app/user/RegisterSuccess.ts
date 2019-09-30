import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import './RegisterSuccess.less';

@Component({
  template: html`
  <SimpleFrame>
    <div class="ui-register-success-page flex-col">
      <XIcon name="completed" size="60px"/>
      <span class="congrat">恭喜您!&nbsp;&nbsp;注册完成</span>
      <span class="auto-goback">{{maxTimeout}}s后返回登录页</span>
      <Button type="primary" @click="goHome" class="simpleframe-btn go-home">去登录</Button>
    </div>
  </SimpleFrame>
  `
})
export default class RegisterSuccess extends Vue {
  timer = null;
  maxTimeout: number = 5;
  
  goHome() {
    this.$router.push({name: 'oneid.login', query: {next: String(this.$route.query.next) || ''}});
  }

  created() {
    this.timer = setInterval(this.checkTimeout, 1000);
  }

  checkTimeout() {
    if (--this.maxTimeout > 0) {
      return;
    }
    else {
      clearInterval(this.timer);
      this.goHome();
    }
  }
  destroyed() {
    clearInterval(this.timer);
  }
}