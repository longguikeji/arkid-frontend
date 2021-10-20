<template>
  <draggable
    :list="state.list"
    :options="state.options"
    class="drag-board"
    @end="end"
  >
    <template v-for="(item, index) in state.list">
      <CardPanel
        :key="index"
        :path="getChildPath(`list[${index}]`)"
        class="item"
      />
    </template>
  </draggable>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import draggable from 'vuedraggable'
import BaseVue from '@/admin/base/BaseVue'
import DragBoardState from './DragBoardState'
import CardPanel from '../CardPanel/index.vue'

@Component({
  name: 'DragBoard',
  components: {
    draggable,
    CardPanel
  }
})
export default class extends Mixins(BaseVue) {
  get state(): DragBoardState {
    return this.$state
  }

  // action operation
  end() {
    const action = this.state.endAction
    if (action) {
      this.runAction(action)
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-board {
  .item {
    display: inline-block;
  }
}
</style>
