import * as api from '@/services/oneid'
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component({
  template: html`
      <ul class="ui-user-info">
        <li data-label="用户名">{{ user.username }}</li>
        <li data-label="姓名">{{ user.name || '-' }}</li>
        <li data-label="电话">{{ user.mobile || '-' }}</li>
        <li data-label="工号">{{ user.employee_number || '-' }}</li>
        <li data-label="个人邮箱">{{ user.private_email || '-' }}</li>
        <li data-label="企业邮箱">{{ user.email || '-' }}</li>
        <li data-label="性别">{{ user.gender && ['-', '男', '女'][user.gender] || '-' }}</li>
        <li v-if="user.depts" data-label="部门">{{ user.depts.map(x => x.name).join(', ') }}</li>

        <Divider>自定义字段</Divider>

        <li :key="field.uuid" v-for="field of customFields" :data-label="field.name">{{user.custom_user[field.uuid]}}</li>
      </ul>
  `,
})
export default class UserInfoList extends Vue {
  @Prop() user!: any

  get addNewFieldType(){
    if(this.user.isExternUser){
      return 'extern_user'
    }
    return 'user'
  }

  customFields = []

  async created(){
    this.customFields = await api.CustomFieldConfig.getList(this.addNewFieldType)
  }
}
