<template>
  <el-collapse
    v-model="state.activeNames"
    accordion
    @change="handleChange"
  >
    <el-collapse-item
      v-for="(item, index) in state.data"
      :key="index"
      :title="item.title"
      :name="item.name"
      :disabled="item.disabled"
    >
      {{ item.content }}
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import CollapseState from './CollapseState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Collapse'
})
export default class extends Mixins(BaseVue) {
  get state(): CollapseState {
    return this.$state as CollapseState
  }

  handleChange() {
    // console.log(this.state.activeNames)
  }
}
</script>
<style lang="scss" scoped></style>
