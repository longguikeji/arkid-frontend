import * as model from '@/models/oneid'
import Choose from '@/oneid-app/comps/choose/Choose'
import * as api from '@/services/oneid'
import { Component, Prop, Vue } from 'vue-property-decorator'
import './EditManager.less'

@Component({
  components: {
    Choose,
  },
  template: html`
    <div class="ui-edit-manager-page">
      <div class="ui-edit-manager-page--body">
        <div class="ui-edit-manager-page--body-wrapper" v-if="form">
          <div class="manager-settings">
            <div class="manager-settings-users">
              <span class="ui-edit-manager-page--label">成员：</span>
              <div class="ui-edit-manager-page--content-side">
                <div class="node-user-list" @click="doStartChooseUser">
                  <span v-if="form.users.length === 0" class="placeholder"
                    >请选择用户</span
                  >
                  <span v-for="item in form.users" class="tag"
                    >{{ item.name }}</span
                  >
                </div>
                <Choose
                  v-if="chooseUser"
                  v-bind="chooseUser"
                  ref="chooseUser"
                  @on-ok="onChooseUserOk"
                />
              </div>
            </div>
            <div class="manager-settings-scopes">
              <span class="ui-edit-manager-page--label">管理范围：</span>
              <div class="ui-edit-manager-page--content-side">
                <span class="ui-edit-manager-page--help">
                  子管理员可以对五种分组类型（账号、部门、角色、标签、自定义分组类型）进行管理，每组子管理员至少要选择一种分组类型来管理
                </span>
                <RadioGroup
                  vertical
                  v-model="form.managerGroup.scopeSubject"
                  class="radio-mode"
                >
                  <Radio :label="1">所在分组及下级分组</Radio>
                  <Radio :label="2">特定账号及分组</Radio>
                </RadioGroup>
                <div
                  v-if="form.managerGroup.scopeSubject === 2"
                  class="node-user-list"
                  @click="doStartChooseScope"
                >
                  <span
                    v-if="form.managerGroup.nodes.length === 0 && form.managerGroup.users.length === 0"
                    class="placeholder"
                  >
                    请选择特定账号及分组
                  </span>
                  <span v-for="item in form.managerGroup.nodes" class="tag"
                    >{{ item.name }}</span
                  >
                  <span v-for="item in form.managerGroup.users" class="tag"
                    >{{ item.name }}</span
                  >
                </div>
                <Choose
                  v-if="chooseScope"
                  v-bind="chooseScope"
                  ref="chooseScope"
                  @on-ok="onChooseScopeOk"
                />
              </div>
            </div>
          </div>
          <div class="perm-settings">
            <span class="ui-edit-manager-page--label">分配权限：</span>
            <div class="ui-edit-manager-page--content-side">
              <div class="perm-settings-header">
                <span class="ui-edit-manager-page--help"
                  >将会在上面选择的子管理员名单范围内配置权限</span
                >
                <Checkbox v-model="isAllPerm" @on-change="onIsAllAppChange"
                  ><span>全选</span></Checkbox
                >
              </div>
              <div class="perm-settings-main">
                <div class="perm-settings-main-basic-list">
                  <span class="title">基础权限：</span>
                  <CheckboxGroup v-model="permIds" @on-change="doCheckPerm">
                    <ul v-if="basicPermOptions" class="data-list">
                      <li v-for="item in basicPermOptions" :key="item.id">
                        <div class="logo">
                          <img
                            :src="item.logo ? $fileUrl(item.logo) : defaultLogo"
                          />
                        </div>
                        <span class="name">{{ item.name }}</span>
                        <Checkbox :label="item.id" class="checkbox" />
                      </li>
                    </ul>
                  </CheckboxGroup>
                </div>
                <div class="perm-settings-main-app-list">
                  <span class="title">应用权限：</span>
                  <CheckboxGroup v-model="appIds" @on-change="doCheckApp">
                    <ul v-if="appPermOptions" class="data-list">
                      <li v-for="item in appPermOptions" :key="item.uid">
                        <div class="logo">
                          <img
                            :src="item.logo ? $fileUrl(item.logo) : defaultLogo"
                          />
                        </div>
                        <span class="name">{{ item.name }}</span>
                        <Checkbox :label="item.uid" class="checkbox" />
                      </li>
                    </ul>
                  </CheckboxGroup>
                  <div class="page-wrapper">
                    <Page
                      v-if="appPermOptions.length"
                      :total="pagination.total"
                      :page-size="pagination.pageSize"
                      :current="pagination.current"
                      @on-change="onPageChange"
                      @on-page-size-change="onPageSizeChange"
                      show-total
                      show-sizer
                      class="page flex-row"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ui-edit-manager-page--footer">
        <div class="ui-edit-manager-page--footer-wrapper">
          <Button
            type="error"
            @click="doRemove"
            :style="isNew ? 'visibility: hidden' : ''"
          >
            删除
          </Button>
          <div class="flex-row">
            <Button type="default" @click="$router.back()">取消</Button>
            <Button type="primary" @click="doSave">保存并返回</Button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class EditManager extends Vue {
  basicPermOptions: Array<{ id: string; name: string }> = []
  appPermOptions: model.App[] = []

  permIds: string[] = []
  appIds: string[] = []

  // 应用权限分页
  pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  }

  form: model.Node | null = null
  isAllPerm = false
  tmpAllPerm = false
  tmpPerms: Array<{ id: string; name: string }> = []
  tmpApps: model.App[] = []
  managerUserIds: model.User[] = []

  chooseUser: any = null
  chooseScope: any = null

  defaultLogo: string = require('../../../assets/icons/icon-applicationlist@2x.png')

  get isNew() {
    return this.$route.params.id === '0'
  }

  async loadData() {
    await this.loadOptions()
    await this.loadForm()
  }

  async loadOptions() {
    const {
      results: basicPermOptions,
    } = await api.Config.retrieveMetaPermList()

    this.basicPermOptions = basicPermOptions

    await this.loadAppList()
  }

  async loadAppList() {
    const { results: appPermOptions, count } = await api.App.list({
      page: this.pagination.current,
      pageSize: this.pagination.pageSize,
    })

    this.appPermOptions = appPermOptions
    this.pagination.total = count
  }

  async loadForm() {
    const { id } = this.$route.params
    if (!this.isNew) {
      const res = await api.Node.Manager.oneManager(id)
      this.form = res

      this.permIds = this.form!.managerGroup!.perms.map((i) => i.id)
      this.appIds = this.form!.managerGroup!.apps.map((i) => i.uid)

      this.isOpenAllPerm()
    } else {
      this.form = new model.Node()
    }
  }

  doStartChooseUser() {
    this.chooseUser = {
      title: '选择用户',
      onlyUser: true,
      multiple: true,
      checkedUserIds: this.form!.users.map((u) => u.id),
    }
    this.$nextTick(() => this.$refs.chooseUser.show())
  }

  doStartChooseScope() {
    this.chooseScope = {
      title: '选择特定账号及分组',
      multiple: true,
      checkedIds: this.form!.managerGroup!.nodes.map((n) => n.id),
      checkedUserIds: this.form!.managerGroup!.users.map((u) => u.id),
    }
    this.$nextTick(() => this.$refs.chooseScope.show())
  }

  onChooseUserOk(nodes: model.Node[], users: model.User[]) {
    this.form!.users = users
  }

  onChooseScopeOk(nodes: model.Node[], users: model.User[]) {
    this.form!.managerGroup!.nodes = nodes
    this.form!.managerGroup!.users = users
  }

  doCheckPerm() {
    this.form!.managerGroup!.perms = this.basicPermOptions.filter((i) =>
      this.permIds.includes(i.id),
    )
    this.isOpenAllPerm()
  }
  doCheckApp() {
    this.form!.managerGroup!.apps = this.appPermOptions.filter((i) =>
      this.appIds.includes(i.uid),
    )
    this.isOpenAllPerm()
  }

  async doSave() {
    const isValid = this.validateForm()
    if (!isValid) {
      return
    }

    const form = this.form!

    form.parent = null
    const userIds = form.users.map((u) => u.id)

    if (this.isNew) {
      const newManager = await api.Manager.create(form)
      await api.Node.Manager.updateUsers(newManager.id, { userIds })
    } else {
      // 增加 all_select 更新属性值, 接口自动处理该内容
      await api.Node.Manager.partialUpdate(form, this.isAllPerm)
      await api.Node.Manager.updateUsers(form.id, { userIds })
    }
    this.$router.back()
  }

  validateForm(): boolean {
    if (this.form!.users.length === 0) {
      this.$Message.error('请设置成员')
      return false
    }
    if (!this.form!.managerGroup!.scopeSubject) {
      this.$Message.error('请设置管理范围')
      return false
    }
    if (
      this.form!.managerGroup!.scopeSubject &&
      this.form!.managerGroup!.scopeSubject === 2 &&
      this.form!.users.length === 0
    ) {
      this.$Message.error('请设置管理范围')
      return false
    }
    return true
  }

  // 如果全选, 则左侧和右侧全部选中
  // 如果取消全选, 则取消所有已选中内容, 不再恢复默认状态
  onIsAllAppChange(isAllPerm: boolean) {
    this.tmpAllPerm = isAllPerm
    if (isAllPerm) {
      // this.tmpApps = this.form!.managerGroup!.apps
      // this.tmpPerms = this.form!.managerGroup!.perms

      this.form!.managerGroup!.apps = this.appPermOptions!
      this.form!.managerGroup!.perms = this.basicPermOptions!
      this.permIds = this.basicPermOptions.map((i) => i.id)
      this.appIds = this.appPermOptions.map((i) => i.uid)
    } else {
      this.form!.managerGroup!.apps = []
      this.form!.managerGroup!.perms = []
      this.permIds = []
      this.appIds = []
    }
  }

  doRemove() {
    this.$Modal.confirm({
      render: () => '删除该子管理员配置',
      onOk: () => this.remove(),
    })
  }

  async remove() {
    const manager = this.form!
    try {
      await api.Node.Manager.updateUsers(manager.id, { userIds: [] })
      await api.Node.Manager.remove(manager.id)
      this.$Message.success('删除成功')
      this.$router.replace({ name: 'admin.manager' })
    } catch (e) {
      this.$Message.error('删除失败')
    }
  }

  async onPageChange(page: number) {
    this.pagination.current = page
    await this.loadAppList().then(() => {
      this.isCheckCurPageAllApp()
    })
  }

  async onPageSizeChange(pageSize: number) {
    this.pagination.pageSize = pageSize
    await this.loadAppList().then(() => {
      this.isCheckCurPageAllApp()
    })
  }

  // 是否启用全选状态
  isOpenAllPerm() {
    if (
      this.permIds.length === this.basicPermOptions.length &&
      this.appIds.length === this.pagination.total
    ) {
      this.isAllPerm = true
    } else {
      this.isAllPerm = false
    }
  }

  // 切换页面之后, 判断当前是否为全选状态
  // 若当前为全选状态, 更新页面视图和数据
  isCheckCurPageAllApp() {
    if (!this.tmpAllPerm) return
    this.appPermOptions.forEach((option) => {
      if (!this.appIds.includes(option.uid)) {
        this.appIds.push(option.uid)
        this.form!.managerGroup!.apps.push(option)
      }
    })
  }

  mounted() {
    this.loadData()
  }
}
