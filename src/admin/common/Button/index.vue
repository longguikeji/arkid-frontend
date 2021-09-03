<template>
  <el-tooltip
    :disabled="isDisabledToolTip"
    :content="buttonTip.content"
    :effect="buttonTip.effect"
  >
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
  </el-tooltip>
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
    return super.$state as ButtonState
  }

  get isDisabledToolTip(): boolean {
    return !this.state.tip || (this.state.tip && this.state.tip.disabled) || false
  }

  get buttonTip() {
    return this.state.tip || {}
  }

  private async clickHandler() {
    if (this.state.type === 'warning' || this.state.type === 'danger' || this.state.isConfirm) {
      let headMessage = ''
      let confirmType: any
      switch (this.state.type) {
        case 'danger':
          headMessage = '警告'
          confirmType = 'error'
          break
        case 'warning':
          headMessage = '提示'
          confirmType = 'warning'
          break
      }
      this.$confirm(this.state.hint || `确定执行${this.state.label || this.state.tip?.content}操作吗？`, headMessage, {
        confirmButtonText: this.state.label,
        cancelButtonText: '取消',
        type: confirmType
      }).then(async() => {
        await this.runAction(this.state.action)
      }).catch((err) => {
        this.$message({
          message: err,
          type: 'error',
          showClose: true
        })
      })
    } else {
      await this.runAction(this.state.action)
    }
  }
}
</script>
