<template>
  <div>
    <el-button
      type="primary"
      style="margin-left: 16px;"
      @click="drawer = true"
    >
      点击打开
    </el-button>
    <el-drawer
      :append-to-body="state.appendToBody || true"
      :close-on-press-escape="state.closeOnPressEscape"
      :custom-class="state.customClass"
      :destroy-on-close="state.destroyOnClose"
      :modal="state.modal"
      :modal-append-to-body="state.modalAppendToBody"
      :direction="state.direction"
      :show-close="state.showClose"
      :size="state.size"
      :title="state.title"
      :visible.sync="drawer"
      :wrapper-closable="state.wrapperClosable"
      :with-header="state.withHeader"
      :before-close="beforeClose"
    >
      <slot />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import DrawerState from './DrawerState'
import Form from '@/admin/common/Form/index.vue'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Drawer',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): DrawerState {
    return this.$state as DrawerState
  }

  drawer = false;
  beforeClose() {
    this.drawer = false
  }
}
</script>

<style lang="scss" scoped></style>
