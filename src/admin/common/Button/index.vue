<template>
  <el-button
    :size="state.size || 'small'"
    :type="state.type"
    :plain="state.plain"
    :round="state.round"
    :circle="state.circle"
    :loading="state.loading"
    :disabled="state.disabled"
    :icon="state.icon"
    :autofocus="state.autofocus"
    :native-type="state.nativeType"
    @click.stop="clickHandler"
  >
    <template v-if="state.label">
      {{ state.label }}
    </template>
  </el-button>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ButtonState from './ButtonState'
import BaseVue from '@/admin/base/BaseVue'
@Component({
  name: 'Button',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): ButtonState {
    return this.$state as ButtonState
  }

  private async clickHandler() {
    const { type, hint, label, to, action } = this.state
    if (type === 'warning' || type === 'danger') {
      let headMessage = ''
      let confirmType: any
      switch (type) {
        case 'danger':
          headMessage = '警告'
          confirmType = 'error'
          break
        case 'warning':
          headMessage = '提示'
          confirmType = 'warning'
          break
      }
      this.$confirm(hint || `确定执行${label}操作吗？`, headMessage, {
        confirmButtonText: label,
        cancelButtonText: '取消',
        type: confirmType
      }).then(async() => {
        await this.runAction(action)
      }).catch((err) => {
        this.$message({
          message: err,
          type: 'error',
          showClose: true
        })
      })
    } else {
      if (action) {
        await this.runAction(action)
      } else if (to) {
        this.$router.push({
          name: to,
          query: this.$route.query
        })
      }
    }
  }
}
</script>
