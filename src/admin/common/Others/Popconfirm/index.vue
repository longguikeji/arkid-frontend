<template>
  <el-popconfirm
    :title="state.title"
    :confirm-button-text="state.confirmButtonText"
    :cancel-button-text="state.cancelButtonText"
    :confirm-button-type="state.confirmButtonType"
    :cancel-button-type="state.cancelButtonType"
    :icon="state.icon"
    :icon-color="state.iconColor"
    :hide-icon="state.hideIcon"
  >
    <el-button slot="reference">
      {{ state.content }}
    </el-button>
  </el-popconfirm>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import PopconfirmState from './PopconfirmState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Popconfirm'
})
export default class extends Mixins(BaseVue) {
  get state(): PopconfirmState {
    return this.$state as PopconfirmState
  }
}
</script>
<style lang="scss" scoped></style>
