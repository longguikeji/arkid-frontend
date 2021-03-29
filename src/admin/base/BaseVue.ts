import { Component, Prop, Vue } from 'vue-property-decorator'
import getDataByPath from '@/utils/datapath'
import { runFlowByFile } from '@/arkfbp'
import { stringify } from 'querystring';

export interface FlowState {
  name:string
  params?:any
}

export interface BaseState {
    created?: Array<FlowState | Function>
    beforeMount?: Array<FlowState | Function>
    mounted?: Array<FlowState | Function>
    beforeUpdate?: Array<FlowState | Function>
    updated?: Array<FlowState | Function>
    beforeDestroy?: Array<FlowState | Function>
    destroyed?: Array<FlowState | Function>
}

@Component({
  name: 'BaseVue'
})
export default class extends Vue {
  @Prop({ required: true }) path!: string;

  get state(): BaseState {
    return this.$state
  }

  get $state(): BaseState {
    const s = getDataByPath(this.$store.state, this.path)
    return s || {}
  }

  getChildPath(path: String|Number) {
    let sp = this.path
    if (typeof path === 'number') {
      sp += '[' + path + ']'
    } else if (path[0] === '[') {
      sp += path
    } else if (path !== '') {
      sp += '.' + path
    }
    return sp
  }

  created() {
    this.runAction(this.state.created)
  }

  beforeMount() {
    this.runAction(this.state.beforeMount)
  }

  mounted() {
    this.runAction(this.state.mounted)
  }

  beforeUpdate() {
    this.runAction(this.state.beforeUpdate)
  }

  updated() {
    this.runAction(this.state.updated)
  }

  beforeDestroy() {
    this.runAction(this.state.beforeDestroy)
  }

  destroyed() {
    this.runAction(this.state.destroyed)
  }

  async runAction(flows?:Array<FlowState | Function>) {
    if (flows) {
      flows.forEach(async(flow) => {
        if (flow instanceof Function) {
          flow()
        } else {
          await runFlowByFile(flow.name, {
            com: this,
            params: flow.params
          })
        }
      })
    }
  }
}
