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
    :close-on-click-modal="state.closeOnClickModal || false"
    :close-on-press-escape="state.closeOnPressEscape"
    :show-close="state.showClose"
    :center="state.center"
    :destory-on-close="state.destoryOnClose"
  >
    <AdminComponent :path="dialogPath" />
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

  get defaultWidth() {
    if (document.body.clientWidth > 1400) {
      return '65%'
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

  get dialogPath() {
    if (this.state.page) {
      return `${this.path.substring(0, this.path.indexOf('['))}[${this.state.page}]`
    } else {
      return this.getChildPath('state')
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
::v-deep .el-dialog {
  margin-top: 10vh !important;
  .el-dialog__header {
    padding-top: 0px;
    padding-bottom: 0px;
  }
  .el-dialog__body {
    padding: 0px;
  }
  .el-dialog__headerbtn {
    z-index: 100;
  }
  .el-dialog__close {
    z-index: 100;
  }
  .el-dialog__body .el-card {
    &.form-page,
    &.table-page,
    &.tree-page {
      box-shadow: none;
      border-radius: 0px;
      border: 0px;
      &.is-always-shadow {
        box-shadow: none;
      }
    }
  }
  .el-card__header {
    .buttons {
      right: 30px !important;
    }
  }
  .el-card__body {
    padding: 20px;
    position: relative;
    .form-page-buttons {
      position: sticky;
      bottom: -10px;
      background-color: #fff;
    }
  }
}
</style>
