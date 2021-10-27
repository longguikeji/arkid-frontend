<template>
  <div class="notice-modules">
    <List
      v-for="(key, index) in keys"
      :key="index"
      :path="getChildPath(key)"
      class="notice-modules-list"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Notice'
})
export default class extends Mixins(BaseVue) {
  get state() {
    return this.$state
  }

  get keys() {
    return Object.keys(this.state)
  }
}
</script>

<style lang="scss" scoped>

</style>
