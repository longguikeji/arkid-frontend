<template>
  <div>
    <el-select
      v-model="state.value"
      value-key="uuid"
      :multiple="state.multiple"
      :disabled="state.readonly"
      @focus="toSetListData"
    >
      <el-option
        v-for="item in state.options"
        :key="item.value"
        :label="item.label || item.name"
        :value="item.value || item.uuid"
      />
    </el-select>
    <svg-icon
      v-if="state.required"
      class="required"
      name="required"
      width="20"
      height="20"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import InputListState from './InputListState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'InputList',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): InputListState {
    return this.$state as InputListState
  }

  private async toSetListData() {
    this.runAction(this.state.action)
  }
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
}
.col {
  margin: 12px;
  flex: auto;
}
</style>
