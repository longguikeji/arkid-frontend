<template>
  <el-collapse
    v-model="active"
    accordion
    class="collapse-list"
  >
    <el-collapse-item
      name="active"
      class="collapse-list-content"
    >
      <template slot="title">
        <span>{{ state.title }}</span>
      </template>
      <div
        v-for="(item, index) in items"
        :key="index"
        class="collapse-list-item"
      >
        {{ item.label }}
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import ListState from './ListState'

@Component({
  name: 'List'
})
export default class extends Mixins(BaseVue) {
  private active = 'active'

  get state(): ListState {
    return this.$state as ListState
  }

  get items() {
    return this.state.items
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-collapse-item__header {
  font-size: 16px;
  padding: 18px 10px;
  border-radius: 2px 2px 0px 0px;
  border-bottom: 1px solid #e6ebf5;
  height: 55px;
  font-weight: bold;
}

::v-deep .collapse-list-item {
  padding: 10px;
  cursor: pointer;
  font-size: 15px;
  &:hover {
    background-color: #f5f6f8;
  }
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}
</style>
