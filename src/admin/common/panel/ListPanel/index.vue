<template>
  <el-card>
    <div slot="header">
      <span>{{ state.title }}</span>
    </div>
    <ul>
      <template v-for="(item, index) in state.items">
        <li :key="index">
          {{ item.label }}
        </li>
      </template>
    </ul>
  </el-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ListPanelState from './ListPanelState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'ListPanel',
  components: {
  }
})
export default class extends Mixins(BaseVue) {
  get state(): ListPanelState {
    return this.$state as ListPanelState
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
