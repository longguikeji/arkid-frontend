import { App } from '@/models/oneid'
import * as api from '@/services/oneid'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import AddApp from './AddApp'
import './Application.less'
import ProtocolInterface from './ProtocolInterface'

const required = {required: true, message: 'Required', trigger: 'blur'}

@Component({
  components: {
    AddApp,
    ProtocolInterface,
  },
  template: html`
  <div class="ui-admin-apps-app-list flex-col flex-auto">
    <div v-if="!appList" style="margin: auto; display: flex;">
      <Spin large></Spin>
    </div>
    <div v-if="appList" class="ui-admin-apps-app-list--toolbar flex-row">
      <div class="flex-row">
        <h1>全部应用</h1>
        <Button @click="add">添加应用</Button>
      </div>
      <Input
        v-model='searchText'
        search
        clearable
        placeholder="搜索应用"
        class="search"
        @on-change="onSearchChange"
      />
    </div>
    <div v-if="appList" class="table-wrapper">
      <Table :data="appList" :columns="columns" class="table"/>
    </div>
    <div v-if="appList" class="page-wrapper">
      <Page
        v-if="appList"
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
    <AddApp v-if="showAddApp && appList" @on-change="onAppChange" ref="addApp"/>
    <ProtocolInterface v-if="showProtocolInterface" ref="protocolInterface"/>
  </div>

  `,
})
export default class Application extends Vue {
  $refs: Vue['$refs'] & {
    addApp: AddApp,
    protocolInterface: ProtocolInterface,
  }
  searchText = ''
  showAddApp = false
  showProtocolInterface = false
  appList: App[] | null = null
  pagination = {
    total: 0,
    page: 1,
    pageSize: 10,
    pageSizeOpts: [10, 20, 40, 60, 80, 100],
  }

  getImgSource(key: string) {
    if(key.length === 0) {
      return require('@/assets/icons/auto/defaultapp.svg')
    }
    const tmpUrl = api.File.url(key)
    return tmpUrl
  }

  get columns() {
    const result = [
      {
        title: '应用LOGO',
        width: 150,
        render: (h, params) => {
          const permLogo = h('img', {
            style: {
              width: '28px',
              height: '28px',
              'border-radius': '4px',
            },
            attrs: {
              src: this.getImgSource(this.appList![params.index].logo),
            },
          }, '应用LOGO')
          return h('div', {
            class: 'flex-row',
          }, [permLogo])
        },
      },
      {
        title: '应用名称',
        key: 'name',
        minWidth: 200,
      },
      {
        title: '应用简介',
        key: 'remark',
        minWidth: 200,
      },
      {
        title: '登录协议',
        width: 400,
        render: (h, params) => {
          return h('div', this.appList![params.index].auth_protocols.join(',  '))
        },
      },
      {title: '操作', width: 300, render: (h, params) => {
        const disabled = this.appList![params.index].auth_protocols.length === 0
        const protoInterfaceBtn = h('span', {
          class: {
            'table-btn': true,
            disabled,
          },
          on: disabled ? {} : {
            click: () => {
              this.showProtocol(this.appList![params.index])
            },
          },
        }, '接口详情')
        const protoSetBtn = h('span', {
          class: 'table-btn',
          on: {
            click: () => {
              this.edit(this.appList![params.index])
            },
          },
        }, '编辑')
        const permBtn = h('span', {
          class: 'table-btn',
          on: {
            click: () => {
              this.showPerm(params)
            },
          },
        }, '权限管理')
        return h('div', {
          class: 'flex-row',
        }, [protoInterfaceBtn, protoSetBtn, permBtn])
      }},
    ]
    return result
  }

  async loadData() {
    const {results: appList, count} = await api.App.list({...this.pagination})
    this.appList = appList.map(app => App.fromData(app))
    this.pagination.total = count
  }

  mounted() {
    this.loadData()
  }

  onPageChange(page: number) {
    this.pagination.page = page
    this.loadData()
  }

  showPerm(item) {
    this.$router.push({
      name: 'admin.app.perm',
      params: {uid: item.row.uid, name: item.row.name},
    })
  }

  onPageSizeChange(pageSize: number) {
    if (pageSize === this.pagination.pageSize) {
      return
    }
    this.pagination = {...this.pagination, pageSize}
    this.loadData()
  }

  add() {
    this.showAddApp = false
    this.$nextTick(() => {
      this.showAddApp = true
      this.$nextTick(() => this.$refs.addApp.showModal(null))
    })

  }

  edit(app) {
    this.showAddApp = false
    this.$nextTick(() => {
      this.showAddApp = true
      this.$nextTick(() => this.$refs.addApp.showModal(app))
    })
  }

  showProtocol(app: App) {
    this.showProtocolInterface = false
    this.$nextTick(() => {
      this.showProtocolInterface = true
      this.$nextTick(() => this.$refs.protocolInterface.showModal(app))
    })
  }

  async onSearchChange(event) {
    const {results: appList, count} = await api.App.list({keyword: this.searchText})
    this.appList = appList.map(app => App.fromData(app))
  }

  onAppChange() {
    this.loadData()
  }
}
