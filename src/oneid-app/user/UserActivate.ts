import {Vue, Component, Prop, Watch} from 'vue-property-decorator';

@Component({
  })
export default class UserActivate extends Vue {
  
  created() {
    this.$router.push({name: 'oneid.signup', params:{activate_email_token: this.$route.query.email_token}})
  }
}