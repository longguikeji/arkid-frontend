<template>
  <el-form
    :inline="state.inline || false"
    :size="state.size"
    :disabled="state.disabled"
    :label-suffix="state.labelSuffix"
    :label-position="state.labelPosition || defaultLabelPosition"
    :label-width="state.labelWidth || 'auto'"
  >
    <div class="row">
      <template v-for="(item, prop) in state.items">
        <form-item
          :key="prop"
          :path="getChildPath('items.' + prop)"
          :class="getFormItemClass(prop)"
        />
      </template>
    </div>
  </el-form>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import FormState from './FormState'
import FormItem from './FormItem/index.vue'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Form',
  components: {
    FormItem
  }
})
export default class extends Mixins(BaseVue) {
  get state():FormState {
    return super.$state as FormState
  }

  getFormItemClass(prop) {
    if (this.state.items![prop].type === 'FormObjectItem') {
      return 'fullwidth'
    }
    return ''
  }

  get defaultLabelPosition() {
    // if (document.body.clientWidth < 1400) { return 'top' } else { return 'left' }
    return 'top'
  }
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.fullwidth {
  width: 100%;
}
</style>
