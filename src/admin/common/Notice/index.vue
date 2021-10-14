<template>
  <div class="notice-modules">
    <template v-for="(key, index) in keys">
      <List
        :key="index"
        :path="getChildPath(key)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import ListState from '@/admin/common/List/ListState'

@Component({
  name: 'Notice'
})
export default class extends Mixins(BaseVue) {
  get state(): ListState[] {
    return this.$state as ListState[]
  }

  get keys() {
    return Object.keys(this.state)
  }
}
</script>

<style lang="scss" scoped>

</style>
