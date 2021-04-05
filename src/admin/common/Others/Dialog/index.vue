<template>
  <el-dialog
    v-if="state.visible"
    :title="state.title"
    :visible.sync="state.visible"
    :width="state.width || defaultWidth"
    :fullscreen="state.fullscreen || defaultFullScreen"
    :top="state.top"
    :modal="state.modal || true"
    :modal-append-to-body="state.modalAppendToBody"
    :append-to-body="state.appendToBody || true"
    :lock-scroll="state.lockScroll"
    :custom-class="state.customClass"
    :close-on-click-modal="state.closeOnClickModal || true"
    :close-on-press-escape="state.closeOnPressEscape"
    :show-close="state.showClose"
    :center="state.center"
    :destory-on-close="state.destoryOnClose"
  >
    <AdminComponent :path="getChildPath('')" />

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="dialog__cancel__button"
        :size="state.cancelButtonSize || 'small'"
        @click="state.visible = false"
      >取 消</el-button>
      <ButtonArray
        v-if="state.actions && state.actions.length > 0"
        class="dialog__actions__button"
        :path="getActionPath()"
      />
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import DialogState from './DialogState'
import ButtonArray from '@/admin/common/Button/ButtonArray/index.vue'
import BaseVue from '@/admin/base/BaseVue'
@Component({
  name: 'Dialog',
  components: {
    ButtonArray
  }
})
export default class extends Mixins(BaseVue) {
  get state(): DialogState {
    return this.$state as DialogState
  }

  getActionPath() {
    const data = this.state.data as any
    if (this.state.actions) {
      this.state.actions.forEach((e: any) => {
        e.data = data
      })
    }

    return this.getChildPath('actions')
  }

  get defaultWidth() {
    if (document.body.clientWidth > 1200) {
      return '50%'
    } else if (document.body.clientWidth > 800) {
      return '80%'
    } else {
      return '90%'
    }
  }

  get defaultFullScreen() {
    if (document.body.clientWidth > 500) {
      return false
    } else {
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog__cancel__button {
  margin-right: 10px;
}
.dialog__actions__button {
  display: inline-block !important;
}
::v-deep .el-form-item__label {
  width: 100px;
}

</style>
