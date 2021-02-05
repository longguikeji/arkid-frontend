import {User} from '@/models/oneid'
import * as api from '@/services/oneid'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import './UserList.less'

@Component({
  template: html`
  <div class="ui-choose-userlist">
    <Input
      style="width:150px"
      v-model="userKeyword"
      search
      clearable
      placeholder="搜索"
      @on-change="onUserKeywordChange"
    />
    <Button :disabled="pagination.page ===1 " @click="handlePreviousPage">上一页</Button>
    <Button :disabled="!(pagination.total > 50 && pagination.total/50 > pagination.page)" @click="handleNextPage">下一页</Button>
    <ul v-if="!loading" class="user-list" id="user-list-scroll">
      <li v-for="item in displayUserList">
        <span class="user-name">{{ item.name }}</span>
        <Checkbox
          @on-change="val => onUserCheckChange(item, val)"
          :value="item.checked"
        ></Checkbox>
      </li>
    </ul>
    <div class="loading-spin" v-else>
      <Spin>加载中...</Spin>
    </div>
  </div>
  `,
})
export default class UserList extends Vue {
  @Prop({type: Array, default: () => []}) userSelection!: User[]

  userKeyword: string = ''
  loading: boolean = false
  userList: User[] = []
  displayUserList: User[] = []
  pagination = {
    total: 0,
    page: 1,
    pageSize: 50,
  }

  @Watch('userList', {deep: true, immediate: true})
  onUserListChange() {
    this.getDisplayUserList()
  }

  @Watch('userSelection', {deep: true, immediate: true})
  onUserSelectionChange() {
    this.getDisplayUserList()
  }

  getDisplayUserList() {
    const {userList} = this
    const ids = this.userSelection.map(user => user.id)
    userList.forEach((user: User) => {
      user.checked = ids.includes(user.id)
    })
    this.displayUserList = [...userList]
  }

  handlePreviousPage() {
    this.pagination.page -= 1
    this.loadUser()
  }

  handleNextPage() {
    this.pagination.page += 1
    this.loadUser()
  }

  async loadUser() {
    const {userKeyword: keyword, pagination} = this
    this.loading = true
    const {results, count} = await api.User.list({...pagination, keyword})
    this.userList = results
    this.pagination.total = count
    this.loading = false
  }

  onUserCheckChange(user: User, val: boolean) {
    user.checked = val

    this.$emit(
      'on-check-change',
      this.userList.filter(u => u.checked),
      user,
    )
  }

  onUserKeywordChange() {
    this.pagination.page = 1
    this.loadUser()
  }

  async mounted() {
    await this.loadUser()
  }
}
