<template>
  <el-dropdown trigger="click">
    <i class="el-icon-more" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(item, index) in state"
        :key="index"
      >
        <Button :path="getChildPath(index)" />
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import ButtonState from '../ButtonState'

@Component({
  name: 'ButtonDropdown'
})
export default class ButtonDropdown extends Mixins(BaseVue) {
  get state() {
    return this.$state as ButtonState[]
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown-menu__item {
  border: none;
  background: transparent;
  padding: 0;
  .el-button--primary {
    background-color: transparent;
    color: black;
    border: 0px;
    &:hover {
      background-color: transparent;
    }
  }
  .el-button--danger {
    background-color: transparent;
    color: #ff4949;
    border: 0px;
    &:hover {
      background: transparent;
      color: #ff4949;
    }
  }
}
</style>
