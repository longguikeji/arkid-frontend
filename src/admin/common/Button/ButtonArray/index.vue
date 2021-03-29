<template>
  <div>
    <template v-for="(button, index) in state">
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
import Button from '@/admin/common/Button/index.vue'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'ButtonArray',
  components: {
    Button
  }
})
export default class extends Mixins(BaseVue) {
  get state(): Array<ButtonState> {
    return super.$state as Array<ButtonState>
  }
}
</script>
