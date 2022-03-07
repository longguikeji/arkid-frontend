import * as model from '@/models/oneid'
import * as api from '@/services/oneid'
import {Component, Prop, Vue} from 'vue-property-decorator'
import './Manager.less'

@Component({
  template: html`
  <div class="ui-manager-page">
    <div class="ui-manager-page--header">
      <router-link :to="{name: 'admin.manager.edit', params: {id: '0'}}">
        <Button>添加新的子管理员</Button>
      </router-link>
    </div>
    <div class="ui-manager-page--table">
      <Table
        v-if="managerGroupList"
        :columns="columns"
        :data="managerGroupList"
      ></Table>
    </div>
    <div class="page-wrapper">
      <Page
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
  `,
})
export default class Manager extends Vue {
  managerGroupList: model.Node[]|null = null

  // 分页
  pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  }

  get columns() {
    return [
      {
        title: '成员',
        width: 220,
        render: (h: Vue.CreateElement, {row}: {row: model.Node}) => {
          const {users} = row!
          const names = users.map(user => user.name).join(', ')
          return h('span', names)
        },
      },
      {
        title: '管理范围',
        render: (h: Vue.CreateElement, {row}: {row: model.Node}) => {
          const {scopeSubject, nodes, users} = row.managerGroup!
          return scopeSubject === 1 ? h('span', '所在分组及下级分组')
            : scopeSubject === 2 ? h(TagsCell, {props: {data: [
              ...nodes.map(n => n.name),
              ...users.map(u => u.name),
            ]}})
            : ''
        },
      },
      {
        title: '权限',
        render: (h: Vue.CreateElement, {row}: {row: model.Node}) => {
          const {perms, apps} = row.managerGroup!
          return h(TagsCell, {props: {data: [
            ...perms.map(p => p.name),
            ...apps.map(a => a.name),
          ]}})
        },
      },
      {
        title: '操作',
        width: 140,
        render: (h: Vue.CreateElement, {row}: {row: model.Node}) => {
          const editBtn = h('a', {
            on: {
              click: () => {
                this.$router.push({
                  name: 'admin.manager.edit',
                  params: {id: row.id},
                })
              },
            },
          }, '编辑')
          return editBtn
        },
      },
    ]
  }

  mounted() {
    this.loadData()
  }

  async loadData() {
    const { count, results } = await api.Manager.pagerList({
      page: this.pagination.current,
      pageSize: this.pagination.pageSize,
    })

    this.managerGroupList = results
    this.pagination.total = count
  }

  async onPageChange(page: number) {
    this.pagination.current = page
    await this.loadData()
  }

  async onPageSizeChange(pagSize: number) {
    this.pagination.pageSize = pagSize
    await this.loadData()
  }
}

@Component({
  template: html`
  <div class="tags-cell">
    <span class="tag" v-for="item in data">{{ item }}</span>
  </div>
  `,
})
class TagsCell extends Vue {
  @Prop({type: Array, default: () => []}) data!: string[]
}
