<template>
  <el-checkbox-group v-model="state.value">
    <el-checkbox
      v-for="(item, index) in state.items"
      :key="index"
      :value="item.value"
      :label="item.label"
      :true-label="item.trueLabel"
      :false-label="item.falseLabel"
      :disabled="item.disabled"
      :border="item.border"
      :size="item.size"
      :name="item.name"
      :checked="item.checked"
      :indeterminate="item.indeterminate"
    />
  </el-checkbox-group>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import CheckBoxGroupState from './CheckBoxGroupState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'CheckBoxGroup',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): CheckBoxGroupState {
    return this.$state as CheckBoxGroupState
  }
}
</script>
