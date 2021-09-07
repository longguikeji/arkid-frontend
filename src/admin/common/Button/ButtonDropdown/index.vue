<template>
  <el-select
    v-model="more"
    size="small"
  >
    <el-option
      v-for="(button, index) in state.buttons"
      :key="index"
      :label="button.label"
      :value="index"
      :disabled="button.disabled"
    >
      <Button
        :path="getChildPath(`buttons[${index}]`)"
        class="button-dropdown-button"
      />
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'ButtonDropdown'
})
export default class ButtonDropdown extends Mixins(BaseVue) {
  get state() {
    return this.$state
  }

  get more() {
    return '更多'
  }
}
</script>

<style lang="scss" scoped>
.button-dropdown-button {
  border: none;
  background: transparent;
  padding: 0;
  &.el-button--danger {
    &:hover {
      background: transparent;
      color: #ff4949;
    }
  }
}
</style>
