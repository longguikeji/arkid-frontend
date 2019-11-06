import { Node, Permission } from '@/models/oneid'
import * as api from '@/services/oneid'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import EditNodePerm from './EditNodePerm'
import EditUserPerm from './EditUserPerm'
import './Perm.less'

@Component({
  components: {
    EditNodePerm,
    EditUserPerm,
  },
  template: html`
  <div class="ui-admin-apps-perm flex-col flex-auto">
    <div class="ui-admin-apps-perm--head flex-row">
      <div class="flex-row">
        <Icon type="ios-alarm" size="30"/>
        <h2>{{appName}}的权限</h2>
      </div>
      <Input
        v-model="searchPerm"
        search clearable
        placeholder="搜索权限名称"
        class="search"
        @on-change="onSearchChange"
      />
    </div>
    <div class="ui-admin-apps-perm--menu flex-row">
      <Menu mode="horizontal"
        :theme="dark"
        @on-select="onSelect"
        :active-name="menuName"
      >
        <MenuItem v-for="item in baseMenuItems" :name="item">
        {{item}}
        </MenuItem>
        <Submenu name="自定义分组类型的权限">
          <template slot="title">
          {{ selectedSubMenuItem !== '' ? selectedSubMenuItem : '自定义分组类型的权限' }}
          </template>
          <MenuItem
            v-for="item in subMenuItemList"
            :name="item.name"
          >
            {{ item.name }}
          </MenuItem>
        </Submenu>
      </Menu>
    </div>
    <div class="perm-title">
      <h3 class="subtitle">应用访问权限</h3>
      <div class="table-wrapper">
        <Table
          :border="true"
          :data="accessPerm"
          :columns="accessColumns"
          class="table"
        />
      </div>
    </div>
    <div class="perm-title">
      <div class="inner flex-row">
        <h2 class="subtitle">应用内权限</h2>
        <div class="new-perm">
          <Icon type="md-add-circle" size="15" class="icon" />
          <a class="add-perm" @click="showAdd" href="javascript: void(0)">新权限</a>
        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <Table class="table" :border="true" :data="innerPerm" :columns="innerPermColumns"/>
    </div>
    <div class="page-wrapper">
      <Page
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :page-size-opts="pagination.pageSizeOpts"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        show-total
        show-sizer
        show-elevator
        class="page flex-row"
      />
    </div>
    <EditNodePerm v-if="editNode" @on-save="onEditSave" ref="editNodePerm"/>
    <EditUserPerm @on-save="onUserEditSave" ref="editUserPerm"/>
  </div>
  `,
})
export default class Perm extends Vue {
  $refs: Vue['$refs'] & {
    editNodePerm: EditNodePerm,
    editUserPerm: EditUserPerm,
  }
  pagination = {
    total: 0,
    page: 1,
    pageSize: 10,
    pageSizeOpts: [10, 20, 40, 60, 80, 100],
  }
  editNode = false
  currentPerm: Permission|null = null
  get viewMeta() {
    return {
      breadcrumb: [{label: '全部应用', path: {name: 'admin.app'}}, '应用内权限'],
    }
  }
  baseMenuItems = ['账号的权限', '部门的权限', '标签的权限', '角色的权限']
  baseTableColumnNames = ['权限ID', '权限名称', '权限白名单', '权限黑名单']
  operationName = '新建权限'
  accessPerm: Permission[] = []
  subMenuItemList = []
  selectedSubMenuItem = ''
  innerPerm: Permission[] = []
  metaNodes: Node[] = []
  currentNode: Node|null = null
  columnName = ''
  searchPerm = ''
  wholeNames = ''

  get menuName(): string {
    return (this.$route.query.tab || this.baseMenuItems[0]) as string
  }

  get appUID(): string {
    return this.$route.params.uid
  }

  get appName(): string {
    return this.$route.params.name
  }

  showAdd() {
    this.editNode = false
    this.$nextTick(() => {
      this.editNode = true
      this.$nextTick(() => this.$refs.editNodePerm.showAdd(this.appUID))
    })
  }

  mounted() {
    this.loadData()
  }

  onPageChange(page: number) {
    this.pagination.page = page
    this.loadData()
  }

  onPageSizeChange(pageSize: number) {
    if (pageSize === this.pagination.pageSize) {
      return
    }
    this.pagination = {...this.pagination, pageSize}
    this.loadData()
  }

  async loadData() {
    await this.loadMetaNodes()

    this.subMenuItemList = this.metaNodes.filter(o => o.parent.name === '自定义分组类型')
    this.loadPerms()
  }

  loadPerms() {
    this.selectedSubMenuItem = ''
    if(this.menuName === this.baseMenuItems[0]) {
      this.getAccessPermList('user')
      this.getInnerPermList('user')
      this.currentNode = null
    }
    else if (this.menuName === this.baseMenuItems[1]) {
      this.getAccessPermList('dept')
      this.getInnerPermList('dept')
      this.currentNode = this.metaNodes.filter(o => o.id === 'd_root')[0]
    }
    else if(this.menuName === this.baseMenuItems[2]) {
      this.getAccessPermList('label')
      this.getInnerPermList('label')
      this.currentNode = this.metaNodes.filter(o => o.id === 'g_label')[0]
    }
    else if(this.menuName === this.baseMenuItems[3]) {
      this.getAccessPermList('role')
      this.getInnerPermList('role')
      this.currentNode = this.metaNodes.filter(o => o.id === 'g_role')[0]
    }
    else{
      this.selectedSubMenuItem = this.menuName
      this.currentNode = this.metaNodes.filter(o => o.name === this.menuName)[0]
      this.getAccessPermList(this.currentNode.nodeSubject)
      this.getInnerPermList(this.currentNode.nodeSubject)
    }
  }

  onSelect(menuName: string) {
    const {uid} = this.$route.params
    this.$router.replace({
      name: 'admin.app.perm',
      params: {uid},
      query: {tab: menuName},
    })
    this.loadPerms()
  }

  async getAccessPermList(type: string) {
    const permList = await api.Perm.list({
      scope: this.appUID,
      owner_subject: type,
      action: 'access',
      page_size: this.pagination.pageSize,
      name: this.searchPerm,
    })
    this.accessPerm = permList.data.map(perm => Permission.fromData(perm))
  }

  async getInnerPermList(type: string) {
    const permList = await api.Perm.list({
      scope: this.appUID,
      owner_subject: type,
      action_except: 'access',
      page_size: this.pagination.pageSize,
      page: this.pagination.page,
      name: this.searchPerm,
    })
    this.pagination.total = permList.meta.count
    this.innerPerm = permList.data.map(perm => Permission.fromData(perm))
  }

  showResultDetail(type: string, perm: Permission) {
    this.$refs.editUserPerm.showResultDetail(type, perm)
  }

  async showEdit(columnName: string, perm: Permission) {
    this.currentPerm = perm
    this.columnName = columnName
    if(this.menuName === this.baseMenuItems[0]) {
      this.$refs.editUserPerm.showEdit(columnName, perm)
    }
    else {
      this.editNode = false
      this.$nextTick(() => {
        this.editNode = true
        this.$nextTick(() => this.$refs.editNodePerm.showEdit(columnName, this.currentNode, perm))
      })
    }
  }

  getNamesColumn(permType: string, columnName: string, h, params) {
    let names = []
    let perm = null
    if (columnName === this.baseTableColumnNames[2]) {
      if (permType === 'access') {
        perm = this.accessPerm[params.index]
        names = this.accessPerm[params.index].permit_owners.map(o=> o.name)
      }
      else {
        perm = this.innerPerm[params.index]
        names = this.innerPerm[params.index].permit_owners.map(o=> o.name)
      }
    }
    else if (columnName === this.baseTableColumnNames[3]) {
      if (permType === 'access') {
        perm = this.accessPerm[params.index]
        names = this.accessPerm[params.index].reject_owners.map(o=> o.name)
      }
      else {
        perm = this.innerPerm[params.index]
        names = this.innerPerm[params.index].reject_owners.map(o=> o.name)
      }
    }
    const edit = h('span', {
      class: 'table-btn',
      on: {
        click: () => {
          if (permType === 'access') {
            this.showEdit(columnName, this.accessPerm[params.index])
          }
          else {
            this.showEdit(columnName, this.innerPerm[params.index])
          }
        },
      },
    }, '编辑')
    const nameString = names.join(', ')
    const maxCharNumber = 40
    let elements = []
    if(nameString.length > maxCharNumber) {
      elements = [
        nameString.slice(0, maxCharNumber) + '......',
        h('span', {
          slot: 'content',
          style: {
              whiteSpace: 'normal',
          },
        }, names.join(', '))]
    }
    else {
      elements = [
        h('span', {props: {color: '#454445'}}, names.join(', ')),
        h('div', {
          slot: 'content',
          style: {
            whiteSpace: 'normal',
          },
        }, names.join(', '))]
    }
    const permTooltip = h('Tooltip', {
      props: {
        transfer: true,
      },
      on: {
        'on-popper-show': () => {this.getAllNamesList(columnName, perm)},
      },
    }, elements)

    return h('div', {
      class: 'permtags',
    }, [permTooltip, edit])

  }

  async getAllNamesList(columnName: string, perm: Permission) {

    const owners = await api.Perm.permResultList(perm.uid, {
      uid: perm.uid,
      owner_subject: this.currentNode ? this.currentNode.nodeSubject : 'user',
      page_size: 1000000,
      status: columnName.includes('白名单') ? 1 : -1,
    })
    columnName.includes('白名单') ? perm.permit_owners = owners.data : perm.reject_owners = owners.data
  }

  getCommonColumns(permType: string) {
    const result = [
      {
        title: this.baseTableColumnNames[0],
        key: 'perm_id',
        width: '200px',
      },
      {
        title: this.baseTableColumnNames[1],
        key: 'name',
        width: '200px',
      },
      {
        title: this.baseTableColumnNames[2],
        width: '350px',
        render: (h, params) => {
          return this.getNamesColumn(permType, this.baseTableColumnNames[2], h, params)
        },
      },
      {
        title: this.baseTableColumnNames[3],
        width: this.menuName === this.baseMenuItems[0] ? '350px' : null,
        minWidth: 150,
        render: (h, params) => {
          return this.getNamesColumn(permType, this.baseTableColumnNames[3], h, params)
        },
      },
    ]
    if(this.menuName === this.baseMenuItems[0]) {
      result.push(
        {
          title: '结果名单',
          width: null,
          minWidth: 200,
          render: (h, params) => {
            const edit = h('span', {
              class: 'table-btn',
              on: {
                click: () => {
                  if(permType === 'access') {
                    this.showResultDetail('user', this.accessPerm[params.index])
                  }
                  else {
                    this.showResultDetail('user', this.innerPerm[params.index])
                  }
                },
              },
            }, '详细信息')

            return h('div', {
              class: 'perm-results',
            }, [edit])
          },
        },
      )
    }
    return result
  }
  get accessColumns() {
    return this.getCommonColumns('access')
  }

  get innerPermColumns() {
    const result = this.getCommonColumns('inner')

    const operation = {
      title: '操作',
      width: '120px',
      render: (h, params) => {
        const dropDownMenu = h('Dropdown-menu',
          {
            slot: 'list',
          },
          ['重命名', '删除此权限'].map((item) =>
            {
              return h('Dropdown-item',
                {
                  props: {
                    name: item,
                  },
                }, item)
            },
          ),
        )
        const dropDownSpan = h('span',
          {
            class: 'dropdown-column-table-btn',
          },
          [
            h('span', '编辑'),
            h('Icon', {
              props: {
                type: 'ios-arrow-down',
              },
            }),
          ],
        )
        const dropDown = h('Dropdown',
          {
            props: {
              trigger: 'click',
              transfer: true,
            },
            on: {
              'on-click': (name: string) => {
                if(name === '重命名') {
                  this.$refs.editNodePerm.showRename(this.innerPerm[params.index])
                }
                else {
                  this.deletePerm(this.innerPerm[params.index])
                }
              },
            },
          },
          [dropDownMenu, dropDownSpan],
        )
        return h('div',
          {
            class: 'dropdown-column flex-row',
          },
          [dropDown],
        )
      },
    }
    result.push(operation)
    return result
  }

  async loadMetaNodes() {
    const [defaultMetaNode, customMetaNode] = await api.Node.metaNode()
    this.metaNodes = [...defaultMetaNode.children, ...customMetaNode.children]
  }

  onEditSave() {
    this.loadData()
  }

  onUserEditSave() {
    this.loadData()
  }

  async deletePerm(perm: Permission) {
    await api.Perm.remove(perm.uid)
    this.loadData()
  }

  onSearchChange(event) {
    this.loadPerms()
  }
}