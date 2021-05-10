<template>
  <ul v-if="state.length">
    <li
      v-for="(item, index) in state"
      :key="index"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ListItemState from './ListState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'List',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): Array<ListItemState> {
    return this.$state as Array<ListItemState>
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    width: 100%;
    padding: 3px;
    box-sizing: border-box;
    &:hover {
      background-color: #f5f6f8;
    }
  }
}
</style>
