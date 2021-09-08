<template>
  <el-form-item
    :class="itemClass"
    :label-width="state.labelWidth"
    :size="state.size || 'small'"
    :rules="state.rules"
    :show-message="state.showMessage"
    :inline-message="state.inlineMessage"
    :required="state.required"
    :prop="state.prop"
    :error="state.error"
    :label="state.label"
  >
    <AdminComponent
      :path="getChildPath('')"
    />
  </el-form-item>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import FormItemState from './FormItemState'
import AdminComponent from '@/admin/common/AdminComponent/index.vue'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'FormItem',
  components: {
    AdminComponent
  }
})
export default class extends Mixins(BaseVue) {
  get state(): FormItemState {
    return this.$state as FormItemState
  }

  get itemClass() {
    if (this.state.isSetWidth === false) {
      return ''
    } else if (document.body.clientWidth < 600) {
      return 'form-item full-width'
    } else {
      return 'form-item half-width'
    }
  }
}
</script>
<style lang="scss" scoped>
.form-item {
  margin: 16px;
}
.full-width {
  width: 100%;
}
.half-width {
  width: calc(50% - 32px);
}
</style>
