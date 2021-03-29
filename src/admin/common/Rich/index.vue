<template>
  <div>
    <tinymce
      v-model="state.value"
      height="500"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Tinymce from '@/components/Tinymce/index.vue'
import RichState from './RichState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Rich',
  components: {
    Tinymce
  }
})
export default class extends Mixins(BaseVue) {
  get state(): RichState {
    return this.$state as RichState
  }
}
</script>
<style lang="scss">
</style>
