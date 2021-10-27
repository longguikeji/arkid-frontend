import { Component, Prop, Vue } from 'vue-property-decorator'
import getStateByPath from '@/utils/state'
import { runFlowByActionName } from '@/arkfbp'

export interface BaseState {
    created?: string | Function
    beforeMount?: string | Function
    mounted?: string | Function
    beforeUpdate?: string | Function
    updated?: string | Function
    beforeDestroy?: string | Function
    destroyed?: string | Function
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
    const s = getStateByPath(this.$store.state, this.path)
    return s || {}
  }

  get page(): string | null {
    const matchs = this.path.match(/\[(.+?)\]/)
    return matchs ? matchs[1] : null
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

  getAnyStateByPath(path: string) {
    return getStateByPath(this.$store.state, path)
  }

  getAnyPageState(page: string) {
    const path = this.path.substring(0, this.path.indexOf('[')) + `[${page}]` + '.state'
    return getStateByPath(this.$store.state, path)
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

  async runAction(action?: string | Function) {
    if (action) {
      if (action instanceof Function) {
        action()
      } else {
        await runFlowByActionName(this, action)
      }
    }
  }
}
