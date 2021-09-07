<template>
  <div>
    <template v-for="(item, index) in state">
      <ButtonDropdown
        v-if="item.form === 'dropdown'"
        :key="index"
        class="button-dropdown"
        :path="getChildPath(index)"
      />
      <Button
        v-else
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
  get state(): Array<ButtonState> {
    return super.$state as Array<ButtonState>
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
