<template>
  <ul v-if="state.length">
    <template v-for="(item, index) in state">
      <list-item
        :key="index"
        :index="index"
        :path="getChildPath(index)"
      />
    </template>
  </ul>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ListItemState from './ListItem/ListItemState'
import BaseVue from '@/admin/base/BaseVue'
import ListItem from './ListItem/index.vue'

@Component({
  name: 'List',
  components: {
    ListItem
  }
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
}
</style>
