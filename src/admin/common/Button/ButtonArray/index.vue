<template>
  <div>
    <template v-for="(item, index) in state">
      <Button
        :key="index"
        :path="getChildPath(index)"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ButtonState from './../ButtonState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'ButtonArray'
})
export default class extends Mixins(BaseVue) {
  get state(): ButtonState[] {
    return this.$state as ButtonState[]
  }
}
</script>

<style lang="scss" scoped>
.button-dropdown {
  display: inline-block;
  margin-left: 10px;
  width: 90px;
}
</style>
