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
  </div>
  `,
})
export default class Manager extends Vue {
  managerGroupList: model.Node[]|null = null

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

    const managerGroupList = await api.Manager.list()
    this.managerGroupList = managerGroupList

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
