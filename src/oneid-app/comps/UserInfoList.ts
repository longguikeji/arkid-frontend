import {Vue, Component, Prop} from 'vue-property-decorator';


@Component({
  template: html`
      <ul class="ui-user-info">
        <li data-label="用户名">{{ user.username }}</li>
        <li data-label="姓名">{{ user.name || '-' }}</li>
        <li data-label="电话">{{ user.mobile || '-' }}</li>
        <li data-label="工号">{{ orgUser.employeeNumber || '-' }}</li>
        <li data-label="邮箱">{{ user.email || '-' }}</li>
        <li data-label="企业邮箱">{{ user.email2 || '-' }}</li>
        <li data-label="性别">{{ user.gender && ['-', '男', '女'][user.gender] || '-' }}</li>
        <li v-if="user.depts" data-label="部门">{{ user.depts.map(x => x.name).join(', ') }}</li>

        <template v-if="user.custom_user && user.custom_user.pretty">
          <li v-for="item in user.custom_user.pretty" :data-label="item.name">{{ item.value }}</li>
        </template>
      </ul>
  `,
})
export default class UserInfoList extends Vue {
  @Prop() user!: any;
  @Prop() orgUser!: any;
}
